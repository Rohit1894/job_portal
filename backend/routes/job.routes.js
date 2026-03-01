import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/create", isAuthenticated, createJob);
router.get("/", getAllJobs);
router.get("/my", isAuthenticated, getMyJobs);
router.get("/:id", getJobById);
router.patch("/update/:id", isAuthenticated, updateJob);

export default router;