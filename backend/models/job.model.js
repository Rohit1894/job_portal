const { application } = require("express");
const mongoose = require("mongoose");


const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String,
        required: true
    }],
    salary: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.mongoose.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [{
        type: mongoose.mongoose.Types.ObjectId,
        ref: 'Application'
    }],


},{ timestamps: true });

module.exports = mongoose.model('Job', jobSchema);