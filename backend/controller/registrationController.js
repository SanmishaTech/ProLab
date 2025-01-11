const Registration = require("../Schema/registration");
const mongoose = require("mongoose");
const Service = require("../Schema/services");
const Holiday = require("../Schema/holiday");
const WorkingHours = require("../Schema/workinghours");
const { HolidayIndex } = require("../congif");

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
  return bol;
};

// Utility function to check if a date is a holiday
const isHoliday = (date, holidays) => {
  return holidays.some(
    (holiday) =>
      new Date(holiday.date).toISOString().split("T")[0] ===
      date.toISOString().split("T")[0]
  );
};

// Utility function to get working hours for a day
const getWorkingHours = async (userId, dayOfWeek) => {
  const workingHours = await WorkingHours.findOne({ userId });
  if (!workingHours) {
    // Return default working hours
    return {
      nonWorkingDay: dayOfWeek === "sunday",
      workingHours: { from: "09:00", to: "19:00" },
      break: { from: "18:00", to: "19:00" },
    };
  }

  const schedule = workingHours.schedule.find((s) => s.day === dayOfWeek);
  return schedule;
};

// Utility function to calculate hours between times accounting for breaks
const calculateWorkingHours = (startTime, endTime, breakTime) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const [breakStartHour, breakStartMinute] = breakTime.from
    .split(":")
    .map(Number);
  const [breakEndHour, breakEndMinute] = breakTime.to.split(":").map(Number);

  let totalMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  const breakMinutes =
    breakEndHour * 60 +
    breakEndMinute -
    (breakStartHour * 60 + breakStartMinute);

  // If work spans break time, subtract break duration
  if (startHour < breakStartHour && endHour > breakEndHour) {
    totalMinutes -= breakMinutes;
  }

  return totalMinutes / 60; // Convert to hours
};

// **Final Revised calculateCompletionDate Function**
const calculateCompletionDate = async (
  startDate,
  maxDuration,
  holidays,
  userId
) => {
  let workingDaysCounted = 0;
  let currentDate = addDays(startDate, 1); // Start from tomorrow
  let totalDaysAdded = 0;
  let remainingHours = maxDuration;

  console.log("Starting Completion Date Calculation");
  console.log("Start Date:", startDate.toISOString().split("T")[0]);
  console.log("Max Duration (Hours):", maxDuration);

  while (remainingHours > 0) {
    const dayOfWeek = currentDate
      .toLocaleDateString("en-US", { weekday: "saturday" })
      .toLowerCase();
    const daySchedule = await getWorkingHours(userId, dayOfWeek);

    if (!daySchedule.nonWorkingDay && !isHoliday(currentDate, holidays)) {
      // Calculate working hours for this day
      const hoursToday = calculateWorkingHours(
        daySchedule.workingHours.from,
        daySchedule.workingHours.to,
        daySchedule.break
      );

      remainingHours -= hoursToday;
      workingDaysCounted += 1;
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
  calculateCompletionTime: async (req, res) => {
    try {
      const { startTime, duration, workingHours, holidays } = req.body;

      const { completionDate, totalCompletionDays } =
        await calculateCompletionDate(
          new Date(startTime),
          duration,
          holidays,
          workingHours.userId
        );

      res.status(200).json({ completionDate, totalCompletionDays });
    } catch (error) {
      console.error("Error calculating completion time:", error);
      res.status(500).json({ error: error.message });
    }
  },

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

      // Get holidays
      const holidays = await Holiday.find();

      // Calculate max duration from tests
      const maxDuration = tests.reduce((max, test) => {
        const duration = test.urgent ? test.urgentTime : test.tat;
        return Math.max(max, duration);
      }, 0);

      // Calculate completion date using working hours
      const { completionDate, totalCompletionDays } =
        await calculateCompletionDate(
          new Date(),
          maxDuration,
          holidays,
          userId
        );

      // Create the new registration with the calculated completion date
      const newRegistration = new Registration({
        patientId,
        referral,
        tests: tests.map((test) => ({
          ...test,
          expectedCompletionTime: test.expectedCompletionTime || completionDate,
        })),
        totaltestprice,
        discount,
        priceAfterDiscount,
        homevisit,
        priceafterhomevisit,
        paymentMode,
        totalBalance,
        paymentDeliveryMode,
        userId,
        maxCompletionTime: completionDate,
      });
      const collectionCenter = [
        {
          collectionCenterName: "Impact Dignostics",
          collectionTime: new Date(),
        },
      ];

      newRegistration.updateOne(
        { $set: { collectionCenter: collectionCenter } },
        { new: true }
      );

      await newRegistration.save();
      const populatedRegistration = await Registration.findById(
        newRegistration._id
      )
        .populate("patientId")
        .populate("userId")
        .populate("tests")
        .populate({
          path: "referral",
          populate: {
            path: "primaryRefferal",
          },
        });

      res.status(201).json(populatedRegistration);
    } catch (error) {
      console.error("Error creating registration:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getAllservices: async (req, res, next) => {
    try {
      console.log("All registration");
      const patients = await Registration.find()
        .populate("patientId")
        .populate("referral")
        .populate("services");

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
          path: "tests",
          populate: {
            path: "tests",
            populate: {
              path: "department",
            },
          },
        });

      console.log("This is patients", patients);

      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const referenceId = req.params.referenceId;
      const reference = await Registration.findById(referenceId)
        .populate("patientId")
        .populate("referral")
        .populate({
          path: "tests",
          populate: {
            path: "tests",
            populate: {
              path: "department",
            },
          },
        });

      res.status(200).json(reference);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  createpayment: async (req, res, next) => {
    try {
      const {
        paymentMode,
        paidAmount,
        paymentDate,
        staffName,
        upiNumber,
        referenceNumber,
      } = req.body;
      const newService = new Payment({
        paymentMode,
        paidAmount,
        paymentDate,
        staffName,
        upiNumber,
        referenceNumber,
      });
      const newServics = await newService.save();

      res.json({
        message: "Payment created successfully",
        service: newServics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const referenceId = req.params.referenceId;
      const { name } = req.body;

      const newService = await Registration.findByIdAndUpdate(
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
