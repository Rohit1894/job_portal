import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const applyForJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Prevent duplicate application
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // Push application ID into job
    job.applications.push(application._id);
    await job.save();

    return res.status(201).json({
      message: "Applied successfully",
      success: true,
      application,
    });

  } catch (error) {
    console.error("Apply Job Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

/* =========================
   GET JOBS APPLIED BY USER
========================= */
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({
      applicant: userId,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    console.error("Get My Applications Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

/* =========================
   GET APPLICANTS FOR A JOB (Recruiter)
========================= */
export const getApplicantsForJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const applications = await Application.find({
      job: jobId,
    })
      .populate("applicant", "fullName email phoneNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    console.error("Get Applicants Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        success: false,
      });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      message: "Application status updated",
      success: true,
      application,
    });

  } catch (error) {
    console.error("Update Application Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};