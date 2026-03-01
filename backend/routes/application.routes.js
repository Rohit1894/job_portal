import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

// Apply to job
router.post("/apply/:id", isAuthenticated, applyForJob);

// Get logged-in user's applications
router.get("/my", isAuthenticated, getMyApplications);

// Recruiter: get applicants for a job
router.get("/job/:id", isAuthenticated, getApplicantsForJob);

// Update application status
router.patch("/status/:id", isAuthenticated, updateApplicationStatus);

export default router;