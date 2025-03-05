const Department = require("../Schema/specimen");
const mongoose = require("mongoose");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const { specimen, userId } = req.body;
      const newService = new Department({
        specimen,
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
      const doctor = await Department.find({ userId: usertobefound });
      // .populate({
      //   path: "services",
      //   populate: { path: "services" },
      // });

      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const doctorId = req.params.departmentId;
      const services = await Department.findById(doctorId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const doctorId = req.params.departmentId;
      const { specimen, userId } = req.body;

      const newService = await Department.findByIdAndUpdate(
        doctorId,
        {
          specimen,
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
      const doctorId = req.params.specimenId;
      const newService = await Department.findByIdAndDelete(doctorId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  searchdepartment: async (req, res, next) => {
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
      if (search.trim()) {
        query.$or = [{ name: { $regex: `^${search}`, $options: "i" } }];
      }

      // Execute both the paginated query and count in parallel
      const [patients, total] = await Promise.all([
        Department.find(query).skip(skip).limit(limit).lean(),

        Department.countDocuments(query),
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
