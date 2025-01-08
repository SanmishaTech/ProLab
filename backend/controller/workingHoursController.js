const WorkingHours = require("../Schema/workinghours");
const mongoose = require("mongoose");

const workingHoursController = {
  // Create or update working hours for a user
  createOrUpdate: async (req, res) => {
    try {
      const { userId, schedule } = req.body;
      const usertobefound = new mongoose.Types.ObjectId(userId);

      let workingHours = await WorkingHours.findOne({ userId: usertobefound });

      if (workingHours) {
        // Update existing working hours
        workingHours.schedule = schedule;
        await workingHours.save();
      } else {
        // Create new working hours
        workingHours = new WorkingHours({
          userId,
          schedule,
        });
        await workingHours.save();
      }

      res.status(200).json(workingHours);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get working hours for a user
  getWorkingHours: async (req, res) => {
    try {
      const userId = req.params.userId;
      const workingHours = await WorkingHours.findOne({ userId });

      if (!workingHours) {
        // Return default working hours if none set
        const defaultSchedule = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].map((day) => ({
          day,
          nonWorkingDay: day === "sunday",
          workingHours: { from: "09:00", to: "17:00" },
          break: { from: "13:00", to: "14:00" },
        }));

        return res.status(200).json({
          userId,
          schedule: defaultSchedule,
        });
      }

      res.status(200).json(workingHours);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = workingHoursController;
