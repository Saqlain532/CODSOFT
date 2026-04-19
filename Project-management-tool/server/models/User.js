import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['manager', 'developer'],
        default: 'developer'
    },
    profileCreated: {
        type: Boolean,
        default: false
    },
    designation: {
        type: String, // e.g., Full Stack Engineer, SWE, Senior Manager
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    experience: {
        type: String, // Years of experience
        default: ''
    },
    techStack: [String],
    workHistory: [{
        company: String,
        role: String,
        duration: String,
        description: String
    }],
    socialLinks: {
        github: String,
        linkedin: String,
        portfolio: String
    },
    // Projects created by this user
    createdProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    // Projects this user is assigned to
    assignedProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
