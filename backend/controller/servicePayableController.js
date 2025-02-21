const ServicePayable = require("../Schema/servicePayable");
const User = require("../Schema/userSchema");
const mongoose = require("mongoose");
const Test = require("../Schema/testMaster");
const Associate = require("../Schema/associatemaster");
const fs = require("fs");
const csv = require("csv-parser");

const ServicePayableController = {
  createThread: async (req, res, next) => {
    try {
      const { associate, department, test, value, userId } = req.body;
      const associatetobefound = new mongoose.Types.ObjectId(associate);
      const departmenttobefound = new mongoose.Types.ObjectId(department);
      const Usertobefound = new mongoose.Types.ObjectId(userId);
      // const testtobefound = mongoose.Types.ObjectId(test);

      const findexistingservice = await ServicePayable.find({
        associate: associatetobefound,
        // department: departmenttobefound,

        userId: Usertobefound,
      });
      console.log(findexistingservice);
      if (findexistingservice && findexistingservice.length > 0) {
        const updatetests = await ServicePayable.findOneAndUpdate(
          { _id: findexistingservice._id }, // Use the first document's ID
          { associate, department, test, value, userId },
          { new: true } // Option to return the updated document
        );
        return res.json({
          message: "Patients Updated successfully",
          service: updatetests,
        });
      }

      console.log("NOt in loop");

      const newService = new ServicePayable({
        associate,
        department,
        test,
        value,
        userId,
      });
      // console.log(newService);
      const newServics = await newService.save();

      res.json({
        message: "Patients created successfully",
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

      //   const patient = await ServicePayable.find({
      //     userId: usertobefound,
      //   });
      const servicePayable = await ServicePayable.find({
        userId: usertobefound,
      })
        .populate({
          path: "associate",
        })
        .populate({
          path: "test",
        });
      res.status(200).json(servicePayable);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const patientId = req.params.referenceId;
      const services = await ServicePayable.findById(patientId)
        .populate({
          path: "associate",
        })
        .populate({
          path: "test",
        });
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAssociate: async (req, res, next) => {
    try {
      const associateId = req.params.associateId;
      const assocaitetobefound = new mongoose.Types.ObjectId(associateId);
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      let departmenttobefound;
      const departmentId = req.query.departmentId;
      if (departmentId) {
        departmenttobefound = new mongoose.Types.ObjectId(departmentId);
      }
      const services = await ServicePayable.find({
        associate: assocaitetobefound,
        userId: usertobefound,
      })
        .populate({
          path: "associate",
        })
        .populate({
          path: "test",
          populate: {
            path: "testId",
          },
        });
      if (!departmentId) {
        return res.status(200).json(services);
      }
      if (departmentId !== undefined && services.length > 0) {
        services[0].test = services[0]?.test?.filter((item) => {
          // If testId.department is an ObjectId, use .equals:
          // return item.testId.department.equals(departmenttobefound);
          // Alternatively, if comparing strings:
          // console.log(item?.testId?.department.toString());
          return item && item.testId?.department?.toString() === departmentId;
        });
      }
      // res.status(200).json(services);

      console.log(services[0].test?.length);
      if (services[0].test?.length > 0) {
        let tests = await Test.find({
          userId: usertobefound,
        });

        let filtertestsnotfoundinServices = tests.filter((item) =>
          services[0].test.some((service) => service.testId?._id !== item._id)
        );
        if (departmentId !== undefined) {
          filtertestsnotfoundinServices = filtertestsnotfoundinServices.filter(
            (item) => {
              // If testId.department is an ObjectId, use .equals:
              // return item.testId.department.equals(departmenttobefound);
              // Alternatively, if comparing strings:
              // console.log(item?.testId?.department.toString());
              return item && item?.department?.toString() === departmentId;
            }
          );
        }

        // console.log("Updated services", services[0].test);

        console.log(filtertestsnotfoundinServices);
        const updatedservices = {
          associate: services[0].associate,
          department: services[0].department,
          test: filtertestsnotfoundinServices.map((item) => {
            return {
              testId: item,
              price: services[0].test.find(
                (service) =>
                  service.testId?._id.toString() === item._id.toString()
              )?.price,
              percentage: item.percentage,
            };
          }),
          // value: services[0].value,
          userId: services[0].userId,
        };

        res.status(200).json([updatedservices]);
      } else {
        console.log("Not found");
        let tests = await Test.find({
          userId: usertobefound,
        });
        const servic = {
          associate: associateId,
          test: tests.map((item) => {
            return {
              testId: item,
              price: item.price,
              percentage: item.percentage,
            };
          }),
        };

        if (departmentId !== undefined) {
          servic.test = servic?.test?.filter((item) => {
            // If testId.department is an ObjectId, use .equals:
            // return item.testId.department.equals(departmenttobefound);
            // Alternatively, if comparing strings:
            // console.log(item?.testId?.department.toString());
            return item && item.testId?.department?.toString() === departmentId;
          });
        }

        res.status(200).json([servic]);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const patientId = req.params.associateId;
      const { associate, department, test, value, userId } = req.body;

      const newService = await ServicePayable.findByIdAndUpdate(
        patientId,
        {
          associate,
          department,
          test,
          value,
          userId,
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
      const patientId = req.params.specimenId;
      const newService = await ServicePayable.findByIdAndDelete(patientId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = ServicePayableController;
