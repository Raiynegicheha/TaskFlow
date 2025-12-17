const Task = require("../models/Task");
const Project = require("../models/Project");

//@desc Get all tasks for a projects
//@route GET /api/projects/:projectId/tasks
//@access Private
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    //verify user has access to this project and existance of project
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const hasAccess =
      project.owner.toString() === req.user.id ||
      project.teamMembers.some((member) => member.toString());

    if (!hasAccess) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to this project" });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error("Get tasks error", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

//   @desc Get single task
//   @route GET /api/tasks/:id
//   @access Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name");

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    //verify user has access to this project
    const project = await Project.findById(task.project._id);
    const hasAccess =
      project.owner.toString() === req.user.id ||
      project.teamMembers.some((member) => member.toString());

    if (!hasAccess) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to this task" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error("Get task error", error);
    res.status(500).json({
      success: false,
      message: "Error fetching task",
      error: error.message,
    });
  }
};

//   @desc Create new task
//   @route POST /api/projects/:projectId/tasks
//   @access Private
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo, dueDate, priority, status, tags } =
      req.body;

    //verify user has access to this project and existance of project
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const hasAccess =
      project.owner.toString() === req.user.id ||
      project.teamMembers.some((member) => member.toString() === req.user.id);

    if (!hasAccess) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to this project" });
    }

    //Get the highest order number for this status
    const lastTask = await Task.findOne({
      project: projectId,
      status: status || "todo",
    }).sort({ order: -1 });

    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      project: projectId,
      assignedTo,
      createdBy: req.user.id,
      dueDate,
      tags,
      order,
    });

    await task.populate("assignedTo", "name email avatar");
    await task.populate("createdBy", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error", error);
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};

//   @desc Update task
//   @route PUT /api/tasks/:id
//   @access Private
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    //verify user has access to this project
    const project = await Project.findById(task.project);
    const hasAccess =
      project.owner.toString() === req.user.id ||
      project.teamMembers.some((member) => member.toString() === req.user.id);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to this task" });
    }

    //if status changed to 'done', set completedAt
    if (req.body.status === "done" && task.status === "done") {
      req.body.completedAt = new Date();
    }

    //If status changed from 'done', clear completedAt
    if (req.body.status !== "done" && task.status === "done") {
      req.body.completedAt = null;
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task error", error);
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

//   @desc Delete task
//   @route DELETE /api/tasks/:id
//   @access Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    //verify user has access to this project
    const project = await Project.findById(task.project);
    const hasAccess =
      req.user.id === project.owner.toString() ||
      project.teamMembers.some((member) => member.toString() === req.user.id);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to this task" });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete task error", error);
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// @desc Bulk update task order/status (for drag and drop)
// @route PUT /api/projects/:projectId/tasks/reorder
// access Private
exports.reorderTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { tasks } = req.body; // Array of tasks with id, status, order

    //verify user has access to this project
    const project = await Project.findById(projectId);
    const hasAccess =
      project.owner.toString() === req.user.id ||
      project.teamMembers.some((member) => member.toString() === req.user.id);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to this project" });
    }

    // Update all tasks
    const updatePromises = tasks.map((taskUpdate) => {
      const updateData = {
        status: taskUpdate.status,
        order: taskUpdate.order,
      };

      //If status changed to 'done', set completedAt
      if (taskUpdate.status === "done") {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }

      return Task.findByIdAndUpdate(taskUpdate.id, updateData, { new: true });
    });

    await Promise.all(updatePromises);

    //Fetch updated tasks
    const updatedTasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: "Tasks reordered successfully",
      data: updatedTasks,
    });
  } catch (error) {
    console.error("Reorder tasks error", error);
    res.status(500).json({
      success: false,
      message: "Error reordering tasks",
      error: error.message,
    });
  }
};
