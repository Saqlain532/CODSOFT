import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A project must have a name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'A project must have a description']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A project must belong to an owner']
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'on-hold', 'doing', 'In progress development', 'testing phase'],
        default: 'planning'
    },
    techStack: [String],
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
