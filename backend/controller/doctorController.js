const Doctors = require("../Schema/doctor");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const {
        name,
        specialization,
        qualification,
        phone,
        email,
        experienceYears,
        branch,
        availableSlots,
      } = req.body;
      const newService = new Doctors({
        name,
        specialization,
        qualification,
        phone,
        email,
        experienceYears,
        branch,
        availableSlots,
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
      const services = await Doctors.find();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const doctorId = req.params.doctorId;
      const services = await Doctors.findById(doctorId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const doctorId = req.params.doctorId;
      const {
        name,
        specialization,
        qualification,
        phone,
        email,
        experienceYears,
        branch,
        availableSlots,
      } = req.body;

      const newService = await Doctors.findByIdAndUpdate(
        doctorId,
        {
          name,
          specialization,
          qualification,
          phone,
          email,
          experienceYears,
          branch,
          availableSlots,
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
