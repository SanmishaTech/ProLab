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
      const name = req.params.name;
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);

      // Use mongoose to find user first if necessary
      const userwithid = await User.findById(userId);
      if (!userwithid) {
        return res.status(404).json({ message: "User not found." });
      }

      const agg = [
        {
          $search: {
            index: "test", // Check if 'lab' is correctly configured in your MongoDB Atlas Search
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

      const patient = await Department.aggregate(agg);

      let tat;
      if (patient[0]?.name) {
        tat = await Tatmaster.find({
          userId: usertobefound,
          selectTest: patient[0]?._id,
        });
      }
      const day = getTodaysDay();
      const workinghours = await WorkingHours.find({
        userId: usertobefound,
      });
      console.log(
        "Working hours:",
        workinghours[0]?.schedule.filter((item) => item.day === day)
      );
      const tatfortoday = workinghours[0]?.schedule.filter(
        (item) => item.day === day
      );
      let calculatedurgenttat;
      let calculatedTat;
      if (tat && workinghours.length > 0) {
        const startTime = new Date();
        const duration = tat[0]?.hoursNeeded || 0;
        const urgentduration = tat[0]?.urgentHours || 0;
        const breakHours = tatfortoday[0]?.break;
        const breakHoursFrom = breakHours?.from.split(":").map(Number);
        const breakHoursTo = breakHours?.to.split(":").map(Number);

        // Calculate the initial end time
        let endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
        let endTimeUrgent = new Date(
          startTime.getTime() + urgentduration * 60 * 60 * 1000
        );

        // Log debug information
        console.log("Start Time:", startTime);
        console.log("Initial End Time (without break):", endTime);
        console.log("Break Hours:", breakHours);

        // If break hours are defined, adjust TAT for breaks that fall within the test duration
        if (breakHoursFrom && breakHoursTo) {
          const breakStart = new Date(startTime);
          breakStart.setHours(
            breakHoursFrom[0],
            breakHoursFrom[1],
            breakHoursFrom[2]
          );

          const breakEnd = new Date(startTime);
          breakEnd.setHours(breakHoursTo[0], breakHoursTo[1], breakHoursTo[2]);

          console.log("Break Start:", breakStart);
          console.log("Break End:", breakEnd);

          // Check if the break time overlaps with the test duration
          if (startTime <= breakEnd && endTime >= breakStart) {
            const overlapStart = Math.max(
              startTime.getTime(),
              breakStart.getTime()
            );
            const overlapEnd = Math.min(endTime.getTime(), breakEnd.getTime());
            const breakDuration =
              (overlapEnd - overlapStart) / (60 * 60 * 1000); // Convert to hours

            console.log("Overlap Start (ms):", overlapStart);
            console.log("Overlap End (ms):", overlapEnd);
            console.log("Break Duration (hours):", breakDuration);

            // Add the break duration to the end time
            if (breakDuration > 0) {
              endTime = new Date(
                endTime.getTime() + breakDuration * 60 * 60 * 1000
              );
              console.log("Adjusted End Time (with break):", endTime);
            }
          } else {
            console.log("No overlap between break time and test duration.");
          }
        } else {
          console.log("Break hours not defined or invalid.");
        }

        if (breakHoursFrom && breakHoursTo) {
          const breakStart = new Date(startTime);
          breakStart.setHours(
            breakHoursFrom[0],
            breakHoursFrom[1],
            breakHoursFrom[2]
          );

          const breakEnd = new Date(startTime);
          breakEnd.setHours(breakHoursTo[0], breakHoursTo[1], breakHoursTo[2]);

          console.log("Break Start:", breakStart);
          console.log("Break End:", breakEnd);

          // Check if the break time overlaps with the test duration
          if (startTime <= breakEnd && endTimeUrgent >= breakStart) {
            const overlapStart = Math.max(
              startTime.getTime(),
              breakStart.getTime()
            );
            const overlapEnd = Math.min(
              endTimeUrgent.getTime(),
              breakEnd.getTime()
            );
            const breakDuration =
              (overlapEnd - overlapStart) / (60 * 60 * 1000); // Convert to hours

            console.log("Overlap Start (ms):", overlapStart);
            console.log("Overlap End (ms):", overlapEnd);
            console.log("Break Duration (hours):", breakDuration);

            // Add the break duration to the end time
            if (breakDuration > 0) {
              endTimeUrgent = new Date(
                endTimeUrgent.getTime() + breakDuration * 60 * 60 * 1000
              );
              console.log("Adjusted End Time (with break):", endTimeUrgent);
            }
          } else {
            console.log("No overlap between break time and test duration.");
          }
        } else {
          console.log("Break hours not defined or invalid.");
        }

        // Final calculated TAT
        calculatedTat = endTime;
        calculatedurgenttat = endTimeUrgent;
        console.log("Final Calculated TAT:", calculatedTat);
        console.log("Final Calculated urgent TAT:", calculatedurgenttat);
      }

      console.log("This is tat", calculatedTat);
      const combinebothdata = {
        tests: patient,
        tat: tat,
        calculatedTat: calculatedTat,
        calculatedurgenttat: calculatedurgenttat,
      };
      res.status(200).json(combinebothdata);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = Servicescontroller;
