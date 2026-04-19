import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getProjectStats = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;

        // Verify project exists
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                status: 'fail',
                message: 'Project not found'
            });
        }

        // Security check: If developer, ensure they have at least one task in THIS project
        if (user.role === 'developer') {
            const hasTask = await Task.findOne({ project: id, assignedTo: user._id });
            if (!hasTask) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Access denied: You are not assigned to this project environment.'
                });
            }
        }

        // Get all tasks for this project
        const tasks = await Task.find({ project: id });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Done').length;
        const ongoingTasks = tasks.filter(t => t.status === 'In-Progress').length;
        const reviewTasks = tasks.filter(t => t.status === 'Review').length;
        const todoTasks = tasks.filter(t => t.status === 'Todo').length;

        const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Group tasks by status for the chart
        const stats = {
            total: totalTasks,
            completed: completedTasks,
            ongoing: ongoingTasks,
            review: reviewTasks,
            todo: todoTasks,
            progress: progressPercent,
            chartData: [todoTasks, ongoingTasks, reviewTasks, completedTasks]
        };

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

export const createProject = async (req, res) => {
    try {
        const { name, description, status, endDate, team, techStack } = req.body;
        
        // Use req.user._id from protect middleware
        const owner = req.user._id;

        const newProject = await Project.create({
            name,
            description,
            status: status || 'planning',
            endDate,
            owner,
            team: team || [],
            techStack: techStack || []
        });

        res.status(201).json({
            status: 'success',
            data: {
                project: newProject
            }
        });
    } catch (error) {
        console.error('Project Creation Error:', error);
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

export const getAllProjectStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all projects owned by this manager
        const projects = await Project.find({ owner: userId });

        const allStats = await Promise.all(projects.map(async (project) => {
            const tasks = await Task.find({ project: project._id });
            const total = tasks.length;
            const completed = tasks.filter(t => t.status === 'Done').length;
            const ongoing = tasks.filter(t => t.status === 'In-Progress').length;
            const review = tasks.filter(t => t.status === 'Review').length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                _id: project._id,
                name: project.name,
                total,
                completed,
                ongoing,
                review,
                progress,
                status: project.status
            };
        }));

        res.status(200).json({
            status: 'success',
            data: {
                projects: allStats
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const userId = req.user._id;
        const { user } = req;
        
        // Find projects where user is owner OR in team
        // NEW: Also allow developers to see projects where they have assigned tasks
        
        let query = {
            $or: [
                { owner: userId },
                { team: userId }
            ]
        };

        const projects = await Project.find(query).populate('owner', 'name email');

        // Check if developer has projects through tasks but not in team array yet
        if (user.role === 'developer' && projects.length === 0) {
            const tasks = await Task.find({ assignedTo: userId }).distinct('project');
            if (tasks.length > 0) {
                const taskProjects = await Project.find({ _id: { $in: tasks } }).populate('owner', 'name email');
                return res.status(200).json({
                    status: 'success',
                    results: taskProjects.length,
                    data: { projects: taskProjects }
                });
            }
        }

        res.status(200).json({
            status: 'success',
            results: projects.length,
            data: {
                projects
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};
