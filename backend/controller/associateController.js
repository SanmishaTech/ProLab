const AssociateMaster = require("../Schema/associatemaster");
const mongoose = require("mongoose");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const {
        associateType,
        salutation,
        firstName,
        lastName,
        organization,
        country,
        state,
        city,
        address,
        telephone,
        mobile,
        email,
        degree,
        userId,
      } = req.body;
      const newService = new AssociateMaster({
        associateType,
        salutation,
        firstName,
        lastName,
        organization,
        country,
        state,
        city,
        address,
        telephone,
        mobile,
        email,
        degree,
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
      const associate = await AssociateMaster.find({ userId: usertobefound });
      // .populate({
      //   path: "services",
      //   populate: { path: "services" },
      // });

      res.status(200).json(associate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const associateId = req.params.referenceId;
      const services = await AssociateMaster.findById(associateId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const associateId = req.params.associateId;
      const {
        associateType,
        salutation,
        firstName,
        lastName,
        organization,
        country,
        state,
        city,
        address,
        telephone,
        mobile,
        email,
        degree,
      } = req.body;

      const newService = await AssociateMaster.findByIdAndUpdate(
        associateId,
        {
          associateType,
          salutation,
          firstName,
          lastName,
          organization,
          country,
          state,
          city,
          address,
          telephone,
          mobile,
          email,
          degree,
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
      const associateId = req.params.specimenId;
      const newService = await AssociateMaster.findByIdAndDelete(associateId);
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
        AssociateMaster.find(query).skip(skip).limit(limit).lean(),
        AssociateMaster.countDocuments(query),
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
