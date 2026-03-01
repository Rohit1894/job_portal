import Company from "../models/company.model.js";
export const createCompany = async (req, res) => {
  try {
    const { name, description, website, location, logo } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    // Prevent duplicate company name
    const existingCompany = await Company.findOne({ name });

    if (existingCompany) {
      return res.status(400).json({
        message: "Company already exists",
        success: false,
      });
    }

    const company = await Company.create({
      name,
      description,
      website,
      location,
      logo,
      createdBy: req.user.id, // from auth middleware
    });

    return res.status(201).json({
      message: "Company created successfully",
      success: true,
      company,
    });

  } catch (error) {
    console.error("Create Company Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getMyCompanies = async (req, res) => {
  try {
    const companies = await Company.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      companies,
    });

  } catch (error) {
    console.error("Get Companies Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });

  } catch (error) {
    console.error("Get Company Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location, logo } = req.body;

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // Optional: only creator can update
    if (company.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this company",
        success: false,
      });
    }

    // Update only provided fields
    if (name) company.name = name;
    if (description) company.description = description;
    if (website) company.website = website;
    if (location) company.location = location;
    if (logo) company.logo = logo;

    await company.save();

    return res.status(200).json({
      message: "Company updated successfully",
      success: true,
      company,
    });

  } catch (error) {
    console.error("Update Company Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

