const Department = require("../Schema/testMaster");
const User = require("../Schema/userSchema");
const Tatmaster = require("../Schema/tatmaster");
const mongoose = require("mongoose");
const WorkingHours = require("../Schema/workinghours");

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

function getTodaysDay() {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = new Date();
  return daysOfWeek[today.getDay()];
}

// Utility function to check if a date is a holiday
const isHoliday = (date, holidays) => {
  return holidays.some(
    (holiday) =>
      new Date(holiday.date).toISOString().split("T")[0] ===
      date.toISOString().split("T")[0]
  );
};

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
  createThread: async (req, res, next) => {
    try {
      const {
        name,
        code,
        abbrivation,
        specimen,
        prerquisite,
        price,
        department,
        consentForm,
        interpretedText,
        profile,
        machineInterface,
        sortOrder,
        isFormTest,
        isSinglePageReport,
        userId,
        outsideAssociates,
        outsource,
        longdurationtests,
        hidedurationregistration,
        singlepagereport,
        suffix,
      } = req.body;
      const newService = new Department({
        name,
        code,
        abbrivation,
        specimen,
        prerquisite,
        price,
        department,
        consentForm,
        interpretedText,
        profile,
        machineInterface,
        sortOrder,
        isFormTest,
        isSinglePageReport,
        userId,
        outsideAssociates,
        outsource,
        longdurationtests,
        hidedurationregistration,
        singlepagereport,
        suffix,
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
      const doctor = await Department.find({ userId: usertobefound })
        .populate({
          path: "specimen",
        })
        .populate({
          path: "department",
        })
        .populate({
          path: "profile",
        })
        .populate({
          path: "outsideAssociates",
        });
      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const doctorId = req.params.testmasterId;
      const services = await Department.findById(doctorId)
        .populate({
          path: "specimen",
        })
        .populate({
          path: "department",
        })
        .populate({
          path: "outsideAssociates",
        })
        .populate({
          path: "profile",
        });
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const doctorId = req.params.testmasterId;
      const {
        name,
        code,
        abbrivation,
        specimen,
        prerquisite,
        price,
        department,
        consentForm,
        interpretedText,
        profile,
        machineInterface,
        sortOrder,
        isFormTest,
        isSinglePageReport,
        outsideAssociates,
        outsource,
        longdurationtests,
        hidedurationregistration,
        singlepagereport,
        suffix,
      } = req.body;

      const newService = await Department.findByIdAndUpdate(
        doctorId,
        {
          name,
          code,
          abbrivation,
          specimen,
          prerquisite,
          price,
          department,
          consentForm,
          interpretedText,
          profile,
          machineInterface,
          sortOrder,
          isFormTest,
          isSinglePageReport,
          outsideAssociates,
          outsource,
          longdurationtests,
          hidedurationregistration,
          singlepagereport,
          suffix,
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
      const doctorId = req.params.testmasterId;
      const newService = await Department.findByIdAndDelete(doctorId);
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
