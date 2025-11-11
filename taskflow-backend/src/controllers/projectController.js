const Project = require('../models/Project');
const User = require('../models/User');

// @desc Get all projects for logged-in user
// @route GET /api/projects
// @access Private
exports.getProjects = async (req, res) => {
  try {
    const { status, priority, sort } = req.query;

    // Build query - find projects where user is owner or team member
    let query = {
      $or: [{ owner: req.user.id }, { teamMembers: req.user.id }],
    };

    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Build sort
    let sortOption = {};
    if (sort === "name") sortOption.name = 1;
    else if (sort === "dueDate") sortOption.dueDate = 1;
    else if (sort === "priority") sortOption.priority = -1;
    else sortOption.createdAt = -1; //Default: newest first

    const projects = await Project.find(query)
      .populate("owner", "name email avatar")
      .populate("teamMembers", "name email avatar")
      .sort(sortOption);

    res
      .status(200)
      .json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

//@desc GET a single project by ID
//@route GET /api/projects/:id
//@access Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("teamMembers", "name email avatar");

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    //Check if user has access to this project (as owner or team member)
    const hasAccess =
      project.owner._id.toString() === req.user.id ||
      project.teamMembers.some(
        (member) => member._id.toString() === req.user.id
      );

    //Check if user has access to this project
    if (!hasAccess) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to this project" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error(error);

    //Handle invalid ObjectId
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: error.message,
    });
  }
};

//@desc Create a new project
//@route POST /api/projects
//@access Private
exports.createProject = async (req, res) => {
  try {
    const { name, description, status, dueDate, priority, color, tags } =
      req.body;

    // Create project with current user as owner
    const project = await Project.create({
      name,
      description,
      status,
      dueDate,
      priority,
      color,
      tags,
      owner: req.user.id,
      teamMembers: [req.user.id], // Owner is also a team member
    });

    // Populate owner and teamMembers fields
    await project.populate("owner", "name email avatar");

    res.status(201).json({
      success: true,
      data: project,
      message: "Project created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message,
    });
  }
};

//@desc Update a project
//@route PUT /api/projects/:id
//@access Private
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    //Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can update the project" });
    }

    //Update project
    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("owner", "name email avatar")
      .populate("teamMembers", "name email avatar");

    res.status(200).json({
      success: true,
      data: project,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("Update project error", error);
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error.message,
    });
  }
};

//@desc DELETE a project
//@route DELETE /api/projects/:id
//@access Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    //Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can delete the project" });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message,
    });
  }
};

//@desc Add team member to project
//@route POST /api/projects/:id/members
//@access Private
exports.addTeamMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    //Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Nor authorized to add team members",
      });
    }

    //Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    //Check if user is already a team member
    if (project.teamMembers.includes(user._id)) {
      return res
        .status(400)
        .json({ success: false, message: "User is already a team member" });
    }

    //Add user to team members
    project.teamMembers.push(user._id);
    await project.save();
    await project.populate("teamMembers", "name email avatar");

    res.status(200).json({
      success: true,
      data: project,
      message: "Team member added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error adding team member",
      error: error.message,
    });
  }
};

//@desc Remove team member from project
//@route DELETE /api/projects/:id/members/:userId
//@access Private
exports.removeTeamMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    //Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove team members",
      });
    }

    //Can't remove the owner
    if (project.owner.toString() === req.params.userId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot remove the project owner" });
    }

    //Remove user from team members
    project.teamMembers = project.teamMembers.filter(
      (memberId) => memberId.toString() !== req.params.userId
    );
    await project.save();
    await project.populate("teamMembers", "name email avatar");

    res.status(200).json({
      success: true,
      data: project,
      message: "Team member removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error removing team member",
      error: error.message,
    });
  }
};
