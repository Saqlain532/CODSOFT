import User from '../models/User.js';
import Task from '../models/Task.js';
import jwt from 'jsonwebtoken';

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-for-dev', {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d'
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    
    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

export const signup = async (req, res) => {
    try {
        console.log('Signup Attempt:', req.body);
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'developer'
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password!'
            });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            });
        }

        // 3) If everything ok, send token to client
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

export const getAllDevelopers = async (req, res) => {
    try {
        const developers = await User.find({ role: 'developer' });
        
        // Get all tasks to calculate workload/progress
        const tasks = await Task.find();

        const developersWithData = developers.map(dev => {
            const devTasks = tasks.filter(t => t.assignedTo.toString() === dev._id.toString());
            const completedTasks = devTasks.filter(t => t.status === 'Done').length;
            const progress = devTasks.length > 0 ? Math.round((completedTasks / devTasks.length) * 100) : 0;

            return {
                ...dev.toObject(),
                tasksCount: devTasks.length,
                progress,
                tasks: devTasks
            };
        });

        res.status(200).json({
            status: 'success',
            results: developersWithData.length,
            data: {
                developers: developersWithData
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { designation, bio, experience, techStack, workHistory, socialLinks } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            designation,
            bio,
            experience,
            techStack,
            workHistory,
            socialLinks,
            profileCreated: true
        }, { new: true, runValidators: true });

        res.status(200).json({
            status: 'success',
            data: { user: updatedUser }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
