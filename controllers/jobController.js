const Job = require("../models/Job")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UNAutheticationError, CustomAPIError, NotFoundRequestError, } = require("../errors")
const notFound = require("../middlewares/not-found")

const getAllJobsOfCurrentUser = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userID }).sort('createdBy')
    res.status(StatusCodes.OK).json({ jobs: jobs, count: jobs.length })
}

const getJobs = async (req, res) => {
    const jobs = await Job.findOne({ _id: req.params.id })
    if (!jobs) {
        throw new NotFoundRequestError(`No Job with id ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({ jobs: jobs, count: jobs.length })
}

const createJobs = async (req, res) => {
    req.body.createdBy = req.user.userID
    const jobs = await Job.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ jobs: jobs })
}

const updateJobs = async (req, res) => {
    const {
        user: { userID, name },
        params: { id },
        body: { company, position }
    } = req
    if (company === '' || position === '') {
        throw new BadRequestError("Company and position must be specified")
    }
    const jobs = await Job.findByIdAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
    if (!jobs) {
        throw new NotFoundRequestError(`No Job with id ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({ jobs: jobs, message: "Job Upadated successfully" })
}
const deleteJobs = async (req, res) => {
    const userID = req.user.userID
    console.log(userID);
    const jobID = req.params.id
    const jobs = await Job.findOne({ _id: jobID })
    if (!jobs) {
        throw new NotFoundRequestError(`No Job with id ${req.params.id}`)
    }
    if (jobs.createdBy != userID) {
        throw new BadRequestError("You cannot delete this job! As this job is not created by you.")
    }
    const deletedJob = await Job.deleteOne({ _id: jobID })
    if (deletedJob.deletedCount === 0) {
        res.status(StatusCodes.OK).json({ message: "Sorry Somthing Went Wrong! Please try after sometime. " })
    }
    res.status(StatusCodes.OK).json({ message: "Job Deleted successfully" })
}

module.exports = {
    getAllJobsOfCurrentUser,
    getJobs,
    createJobs,
    updateJobs,
    deleteJobs,
}