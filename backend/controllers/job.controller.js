import Job from "../models/job.model.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      experience,
      location,
      jobType,
      position,
      company,
    } = req.body;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !experience ||
      !location ||
      !jobType ||
      !position ||
      !company
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(",").map((r) => r.trim()),
      salary,
      experience,
      location,
      jobType,
      position,
      company,
      created_by: req.user.id, // recruiter id
    });

    return res.status(201).json({
      message: "Job created successfully",
      success: true,
      job,
    });

  } catch (error) {
    console.error("Create Job Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company")
      .populate("created_by", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });

  } catch (error) {
    console.error("Get Jobs Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company")
    //   .populate("applications");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });

  } catch (error) {
    console.error("Get Job Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

/* =========================
   GET JOBS CREATED BY LOGGED-IN RECRUITER
========================= */
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      created_by: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });

  } catch (error) {
    console.error("Get My Jobs Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    if (job.created_by.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this job",
        success: false,
      });
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (salary) job.salary = salary;
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (position) job.position = position;

    if (requirements) {
      job.requirements = requirements
        .split(",")
        .map((r) => r.trim());
    }

    await job.save();

    return res.status(200).json({
      message: "Job updated successfully",
      success: true,
      job,
    });

  } catch (error) {
    console.error("Update Job Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};