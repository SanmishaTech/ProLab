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
        services, // Array of { serviceId, urgent }
        paymentMode,
        userId,
      } = req.body;

      // Validation: Ensure at least one service is selected
      if (!services || !Array.isArray(services) || services.length === 0) {
        return res
          .status(400)
          .json({ error: "At least one service must be selected." });
      }

      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID." });
      }

      // Validate patientId
      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({ error: "Invalid patient ID." });
      }

      // Validate referral if provided
      if (referral && !mongoose.Types.ObjectId.isValid(referral)) {
        return res.status(400).json({ error: "Invalid referral ID." });
      }

      // Fetch selected services
      const serviceIds = services.map((s) => s.serviceId);
      const serviceDocs = await Service.find({ _id: { $in: serviceIds } });

      if (!serviceDocs.length) {
        return res.status(400).json({ error: "No valid services selected." });
      }

      // Create a map for quick access to service details
      const serviceMap = {};
      serviceDocs.forEach((service) => {
        serviceMap[service._id.toString()] = service;
      });

      // Calculate total amount considering urgent pricing
      let totalAmount = 0;
      services.forEach((s) => {
        const service = serviceMap[s.serviceId];
        console.log("Service Details:", service);
        if (service) {
          const price = s.urgent ? service.urgentPrice : service.price;
          totalAmount += price; // Assuming quantity is 1; adjust if quantity is involved
        }
      });

      // Fetch holidays for the user
      const holidays = await Holiday.find({
        userId: new mongoose.Types.ObjectId(userId),
      });

      // Calculate maxDuration based on each service's urgency
      let maxDuration = 0;
      services.forEach((s) => {
        const service = serviceMap[s.serviceId];
        if (service) {
          const duration = s.urgent
            ? service.urgentDuration
            : service.durationInDays;
          if (duration > maxDuration) {
            maxDuration = duration;
          }
        }
      });

      console.log("Max Duration (Working Days):", maxDuration);

      // Define registrationDate
      const registrationDate = new Date(); // Current date
      // Reset the time to midnight to avoid partial day calculations
      registrationDate.setHours(0, 0, 0, 0);
      console.log(
        "Registration Date:",
        registrationDate.toISOString().split("T")[0]
      );

      // Calculate the completion date and total completion days
      const { completionDate, totalCompletionDays } = calculateCompletionDate(
        registrationDate,
        maxDuration,
        holidays
      );

      console.log(
        "Final Completion Date:",
        completionDate.toISOString().split("T")[0]
      );
      console.log("Final Total Completion Days:", totalCompletionDays);

      // Prepare paymentMode fields based on paymentMode type
      const paymentDetails = {
        paymentMode: paymentMode.paymentMode,
        paidAmount: paymentMode.paidAmount,
      };

      if (paymentDetails.paymentMode === "UPI") {
        paymentDetails.upiNumber = paymentMode.upiNumber;
      } else if (paymentDetails.paymentMode === "CC/DC") {
        paymentDetails.referenceNumber = paymentMode.referenceNumber;
      }

      // Create the new registration with the calculated completionDays
      const newRegistration = new Registration({
        patientId,
        referral,
        services,
        paymentMode: paymentDetails,
        userId,
        completionDays: totalCompletionDays, // Direct assignment to prevent calculation errors
        completionDate, // Store the exact completion date
        totalAmount, // Store the total amount
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
