import Project from "../models/Project";
import User from "../models/User";


// @desc Get all projects for logged-in user
// @route GET /api/projects
// @access Private
exports.getProjects = async (req, res) => {
    try {
        const { status, priority, sort } = req.query;

        // Build query - find projects where user is owner or team member
        let query = {
            $or: [
                { owner: req.user.id},
                { teamMembers: req.user.id}
            ]
        };

        // Add filters
        if (status) query.status = status;
        if (priority) query.priority = priority;

        // Build sort
        let sortOption = {};
        if (sort === 'name') sortOption.name = 1;
        else if (sort === 'dueDate') sortOption.dueDate = 1;
        else if (sort === 'priority') sortOption.priority = -1;
        else sortOption.createdAt = -1; //Default: newest first

        const projects = await Project.find(query)
        .populate('owner', 'name email avatar')
        .populate('teamMembers', 'name email avatar')
        .sort(sortOption);
    }
}