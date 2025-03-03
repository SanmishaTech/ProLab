const MachineMaster = require("../Schema/machineMaster");
const mongoose = require("mongoose");

const machineController = {
  createThread: async (req, res, next) => {
    try {
      const { name, model, companyName, userId } = req.body;
      console.log("This is userId", userId);
      const newService = new MachineMaster({
        name,
        model,
        companyName,
        userId,
      });
      const newServics = await newService.save();

      res.json({
        message: "Machine created successfully",
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
      const machine = await MachineMaster.find({ userId: usertobefound });
      res.status(200).json(machine);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const machineId = req.params.machineId;
      const services = await MachineMaster.findById(machineId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const machineId = req.params.machineId;
      const { name, model, companyName } = req.body;

      const newService = await MachineMaster.findByIdAndUpdate(
        machineId,
        {
          name,
          model,
          companyName,
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Machine not found." });
      }

      res.json({ message: "Machine updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const machineId = req.params.machineId;
      const newService = await MachineMaster.findByIdAndDelete(machineId);
      if (!newService) {
        return res.status(404).json({ message: "Machine not found." });
      }

      res.json({ message: "Machine deleted successfully.", newService });
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
        MachineMaster.find(query).skip(skip).limit(limit).lean(),

        MachineMaster.countDocuments(query),
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
module.exports = machineController;
