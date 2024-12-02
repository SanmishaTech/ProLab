const Discount = require("../Schema/discountMaster");
const mongoose = require("mongoose");

const discountMasterController = {
  createThread: async (req, res, next) => {
    try {
      const { discountType, value, description } = req.body;
      const newService = new Discount({
        discountType,
        value,
        description,
      });
      const newServics = await newService.save();

      res.json({
        message: "Discount created successfully",
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
      const discount = await Discount.find();

      res.status(200).json(discount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const discountID = req.params.discountId;
      const services = await Discount.findById(discountID);
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
      const discountID = req.params.discountId;
      const { discountType, value, description } = req.body;

      const newService = await Discount.findByIdAndUpdate(
        discountID,
        {
          discountType,
          value,
          description,
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Discount not found." });
      }

      res.json({ message: "Discount updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const discountID = req.params.discountId;
      const newService = await Discount.findByIdAndDelete(discountID);
      if (!newService) {
        return res.status(404).json({ message: "Discount not found." });
      }

      res.json({ message: "Discount deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getDiscountsByType: async (req, res, next) => {
    try {
      // Get the discountType values from the query params
      const { discountType } = req.query;

      // Check if discountType is provided and validate it
      if (
        !discountType ||
        (discountType !== "value" && discountType !== "percentage")
      ) {
        return res.status(400).json({
          message: "Invalid discountType, it must be 'value' or 'percentage'",
        });
      }

      // Query to find documents with the specified discountType
      const discounts = await Discount.find({ discountType: discountType });

      // If no discounts are found, return a message
      if (discounts.length === 0) {
        return res.status(404).json({
          message: `No discounts found for discountType: ${discountType}`,
        });
      }

      // Return the matching discounts
      res.status(200).json(discounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = discountMasterController;
