const express = require('express');
const jobRouter = express.Router();

const { getAllJobsOfCurrentUser, getJobs, createJobs, updateJobs, deleteJobs } = require('../controllers/jobController');

jobRouter.route('/').post(createJobs).get(getAllJobsOfCurrentUser)
jobRouter.route('/:id').patch(updateJobs).get(getJobs).delete(deleteJobs)


module.exports = jobRouter