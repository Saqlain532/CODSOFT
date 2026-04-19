import Task from "../models/Task.js";
import Project from "../models/Project.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, project, assignedTo, priority, deadline } = req.body;

        const newTask = await Task.create({
            title,
            description,
            project,
            assignedTo,
            priority,
            deadline
        });

        // Add developer to project team if not already there
        await Project.findByIdAndUpdate(project, {
            $addToSet: { team: assignedTo }
        });

        res.status(201).json({
            status: 'success',
            data: { task: newTask }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

export const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { user } = req; // Assuming protect middleware adds user to req

        let query = { project: projectId };

        // If user is a developer, only show tasks assigned to them
        if (user.role === 'developer') {
            query.assignedTo = user._id;
        }

        const tasks = await Task.find(query).populate('assignedTo', 'name email');

        res.status(200).json({
            status: 'success',
            data: { tasks }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const { user } = req;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ status: 'fail', message: 'No task found' });

        // Logic check: Only managers can move to "Done"
        if (status === 'Done' && user.role !== 'manager') {
            return res.status(403).json({ 
                status: 'fail', 
                message: 'Only managers can approve and set status to Done.' 
            });
        }

        task.status = status;
        await task.save();

        res.status(200).json({
            status: 'success',
            data: { task }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};
