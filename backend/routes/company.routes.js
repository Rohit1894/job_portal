import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";

import {
  createCompany,
  getMyCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";

const router = express.Router();

router.post("/register", isAuthenticated, createCompany);
router.get("/get", isAuthenticated, getMyCompanies);
router.get("/get/:id", isAuthenticated, getCompanyById);
router.patch("/update/:id", isAuthenticated, updateCompany);

export default router;