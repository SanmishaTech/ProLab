const ParameterGroup = require("../Schema/parameterGroup");
const User = require("../Schema/userSchema");
const mongoose = require("mongoose");

const parameterController = {
  createThread: async (req, res, next) => {
    try {
      const { description, sort, userId } = req.body;
      const newService = new ParameterGroup({
        description,
        sort,
        userId,
      });
      const newServics = await newService.save();

      res.json({
        message: "ParameterGroup group created successfully",
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
      //   const patient = await ParameterGroup.find({
      //     userId: usertobefound,
      //   });
      const parameter = await ParameterGroup.find({ userId: usertobefound });
      res.status(200).json(parameter);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const patientId = req.params.parameterId;
      const services = await ParameterGroup.findById(patientId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  searchbyName: async (req, res, next) => {
    try {
      const name = req.params.name;
      const userId = req.params.userId;

      // Use mongoose to find user first if necessary
      const userwithid = await User.findById(userId);
      if (!userwithid) {
        return res.status(404).json({ message: "User not found." });
      }

      const agg = [
        {
          $search: {
            index: "lab", // Check if 'lab' is correctly configured in your MongoDB Atlas Search
            autocomplete: {
              query: name,
              path: "name",
            },
          },
        },
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId), // Match userId with the correct type
          },
        },
      ];

      const patient = await ParameterGroup.aggregate(agg);
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const patientId = req.params.parameterId;
      const { description, sort } = req.body;

      const newService = await ParameterGroup.findByIdAndUpdate(
        patientId,
        {
          description,
          sort,
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
      const parameterId = req.params.parameterId;
      const newService = await ParameterGroup.findByIdAndDelete(parameterId);
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
        query.$or = [{ description: { $regex: `^${search}`, $options: "i" } }];
      }

      // Execute both the paginated query and count in parallel
      const [patients, total] = await Promise.all([
        ParameterGroup.find(query).skip(skip).limit(limit).lean(),

        ParameterGroup.countDocuments(query),
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
module.exports = parameterController;
