const Role = require("../Schema/roleMaster");
const mongoose = require("mongoose");

const roleMasterController = {
  createThread: async (req, res, next) => {
    try {
      const { role, description } = req.body;
      const newService = new Role({
        role,
        description,
      });
      const newServics = await newService.save();

      res.json({
        message: "Role created successfully",
        service: newServics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const role = await Role.find();
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const roleID = req.params.roleId;
      const services = await Role.findById(roleID);
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

      const patient = await Parameter.aggregate(agg);
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const roleID = req.params.roleId;
      const { role, description } = req.body;

      const newService = await Role.findByIdAndUpdate(
        roleID,
        {
          role,
          description,
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Role not found." });
      }

      res.json({ message: "Role updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const roleID = req.params.roleId;
      const newService = await Role.findByIdAndDelete(roleID);
      if (!newService) {
        return res.status(404).json({ message: "Role not found." });
      }

      res.json({ message: "Role deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = roleMasterController;
