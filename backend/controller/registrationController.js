const Registration = require("../Schema/registration");
const mongoose = require("mongoose");
const Service = require("../Schema/services");
const Holiday = require("../Schema/holiday");
const { HolidayIndex } = require("../congif");
// Utility function to add days to a date
// Utility function to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Utility function to check if a date is a weekend
const isWeekend = (date) => {
  var bol = false;
  const day = date.getDay();
  console.log(
    "Checking if weekend:",
    date.toISOString().split("T")[0],
    "-",
    day
  );
  console.log("This is a day:", day);
  const holidayIndexs = HolidayIndex;
  console.log("This is the holiday index:", holidayIndexs);
  //Now we calculate if the day falls inside the holiday index
  if (holidayIndexs.includes(day)) {
    console.log("This is a holiday day");
    bol = true;
  }
  return bol; // Sunday = 0, Saturday = 6
};

// Utility function to check if a date is a holiday
const isHoliday = (date, holidays) => {
  return holidays.some(
    (holiday) =>
      new Date(holiday.date).toISOString().split("T")[0] ===
      date.toISOString().split("T")[0]
  );
};

// **Final Revised calculateCompletionDate Function**
const calculateCompletionDate = (startDate, maxDuration, holidays) => {
  let workingDaysCounted = 0;
  let currentDate = addDays(startDate, 1); // Start from tomorrow
  let totalDaysAdded = 0;

  console.log("Starting Completion Date Calculation");
  console.log("Start Date:", startDate.toISOString().split("T")[0]);
  console.log("Max Duration (Working Days):", maxDuration);

  while (workingDaysCounted < maxDuration) {
    console.log("Evaluating date:", currentDate.toISOString().split("T")[0]);

    if (!isWeekend(currentDate) && !isHoliday(currentDate, holidays)) {
      // It's a working day
      workingDaysCounted += 1;
      console.log(
        "Working day counted:",
        currentDate.toISOString().split("T")[0],
        "- Total Working Days Counted:",
        workingDaysCounted
      );
    } else {
      if (isWeekend(currentDate)) {
        console.log(
          "Weekend skipped:",
          currentDate.toISOString().split("T")[0]
        );
      }
      if (isHoliday(currentDate, holidays)) {
        console.log(
          "Holiday skipped:",
          currentDate.toISOString().split("T")[0]
        );
      }
      // Non-working day; do not count
    }

    // Move to the next day
    currentDate = addDays(currentDate, 1);
    totalDaysAdded += 1;
  }

  // The completion date is the currentDate after adding totalDaysAdded
  const completionDate = addDays(startDate, totalDaysAdded);
  console.log("Completion Date:", completionDate.toISOString().split("T")[0]);
  console.log("Total Completion Days:", totalDaysAdded);

  return { completionDate, totalCompletionDays: totalDaysAdded };
};

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const {
        patientId,
        referral,
        tests,
        totaltestprice,
        discount,
        priceAfterDiscount,
        homevisit,
        priceafterhomevisit,
        paymentMode,
        totalBalance,
        paymentDeliveryMode,
        userId,
      } = req.body;

      // Create the new registration with the calculated completionDays
      const newRegistration = new Registration({
        patientId,
        referral,
        tests,
        totaltestprice,
        discount,
        priceAfterDiscount,
        homevisit,
        priceafterhomevisit,
        paymentMode,
        totalBalance,
        paymentDeliveryMode,
        userId,
      });

      await newRegistration.save();

      res.status(201).json({
        message: "Registration created successfully",
        registration: newRegistration,
      });
    } catch (error) {
      console.error("Error creating registration:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getAllservices: async (req, res, next) => {
    try {
      console.log("All registration");
      const patients = await Registration.find();
      // .populate("patientId")
      // .populate("referral")
      // .populate("services");
      // .populate({
      //   path: "services",
      //   populate: { path: "services" },
      // });
      console.log(patients);

      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      const patients = await Registration.find({ userId: usertobefound })
        .populate("patientId")
        .populate("referral")
        .populate({
          path: "services",
          populate: { path: "serviceId" }, // Populate the serviceId inside services
        });

      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const referenceId = req.params.referenceId;
      const reference = await Reference.findById(referenceId);
      res.status(200).json(reference);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const referenceId = req.params.referenceId;
      const { name } = req.body;

      const newService = await Reference.findByIdAndUpdate(
        referenceId,
        {
          name,
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
};
module.exports = Servicescontroller;
