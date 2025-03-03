const CorporateMaster = require("../Schema/corporatemaster");
const mongoose = require("mongoose");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const {
        corporateCode,
        corporateName,
        country,
        state,
        city,
        address,
        discount,
        value,
        userId,
      } = req.body;
      const newService = new CorporateMaster({
        corporateCode,
        corporateName,
        country,
        state,
        city,
        address,
        discount,
        value,
        userId,
      });
      const newServics = await newService.save();
      res.json({
        message: "Service created successfully",
        service: newServics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      const corporate = await CorporateMaster.find({ userId: usertobefound });

      res.status(200).json(corporate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const corporateId = req.params.referenceId;
      const services = await CorporateMaster.findById(corporateId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const corporateId = req.params.corporateId;
      const {
        corporateCode,
        corporateName,
        country,
        state,
        city,
        address,
        discount,
        value,
        userId,
      } = req.body;

      const newService = await CorporateMaster.findByIdAndUpdate(
        corporateId,
        {
          corporateCode,
          corporateName,
          country,
          state,
          city,
          address,
          discount,
          value,
          userId,
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const corporateId = req.params.specimenId;
      const newService = await CorporateMaster.findByIdAndDelete(corporateId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  searchbyName: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);

      // Extract pagination and search parameters from query with defaults
      let { page = 1, limit = 10, search = "" } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const skip = (page - 1) * limit;

      // Build the query condition
      const query = { userId: usertobefound };
      console.log("Search", search, query);
      if (search.trim()) {
        query.$or = [
          { name: { $regex: `^${search}`, $options: "i" } },
          // { mobile: { $regex: `^${search}`, $options: "i" } },
        ];
      }

      // Execute both the paginated query and count in parallel
      const [patients, total] = await Promise.all([
        CorporateMaster.find(query).skip(skip).limit(limit).lean(),
        CorporateMaster.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      res.status(200).json({
        patients,
        total,
        page,
        totalPages,
        nextPage,
        prevPage,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = Servicescontroller;
