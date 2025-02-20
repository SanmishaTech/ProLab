const Branch = require("../Schema/branch");
const mongoose = require("mongoose");

const barcodeController = {
  createThread: async (req, res, next) => {
    try {
      const {
        branchName,
        mainBranch,
        branchCode,
        address1,
        address2,
        pinCode,
        country,
        state,
        city,
        contactPerson1,
        contactPerson2,
        designation1,
        designation2,
        contactNumber1,
        contactNumber2,
        fax,
        emailId,
        alternateEmailId,
        currency,
        syncStatus,
        userId,
      } = req.body;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      console.log("UserId", usertobefound);
      const findbranch = await Branch.find({
        userId: usertobefound,
      });
      console.log("FindBranch", findbranch);
      if (findbranch.length > 0) {
        console.log("Branch", findbranch);
        const branchUpdated = await Branch.findByIdAndUpdate(
          findbranch[0]._id,
          {
            branchName,
            mainBranch,
            branchCode,
            address1,
            address2,
            pinCode,
            country,
            state,
            city,
            contactPerson1,
            contactPerson2,
            designation1,
            designation2,
            contactNumber1,
            contactNumber2,
            fax,
            emailId,
            alternateEmailId,
            currency,
            syncStatus,
          },
          { new: true }
        ).then((branchUpdated) => {
          console.log("BranchUpdated", branchUpdated);
        });
        return res.status(200).json({
          message: "Branch updated successfully.",
          branch: branchUpdated,
        });
      }

      const newbarcode = new Branch({
        branchName,
        mainBranch,
        branchCode,
        address1,
        address2,
        pinCode,
        country,
        state,
        city,
        contactPerson1,
        contactPerson2,
        designation1,
        designation2,
        contactNumber1,
        contactNumber2,
        fax,
        emailId,
        alternateEmailId,
        currency,
        syncStatus,
        userId,
      });
      const newBarcode = await newbarcode.save();

      res.json({
        message: "Branch created successfully",
        service: newBarcode,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      const branch = await Branch.find({ userId: usertobefound });

      res.status(200).json(branch);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const barcodeID = req.params.barcodeId;
      const barcode = await Branch.findById(barcodeID);
      res.status(200).json(barcode);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const branchId = req.params.barcodeId;
      const {
        branchName,
        mainBranch,
        branchCode,
        address1,
        address2,
        pinCode,
        country,
        state,
        city,
        contactPerson1,
        contactPerson2,
        designation1,
        designation2,
        contactNumber1,
        contactNumber2,
        fax,
        emailId,
        alternateEmailId,
        currency,
        syncStatus,
      } = req.body;
      const barcode = await Branch.findByIdAndUpdate(
        branchId,
        {
          branchName,
          mainBranch,
          branchCode,
          address1,
          address2,
          pinCode,
          country,
          state,
          city,
          contactPerson1,
          contactPerson2,
          designation1,
          designation2,
          contactNumber1,
          contactNumber2,
          fax,
          emailId,
          alternateEmailId,
          currency,
          syncStatus,
        },
        { new: true }
      );
      if (!barcode) {
        return res.status(404).json({ message: "Branch not found." });
      }

      res.json({ message: "barcode updated successfully.", barcode });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = barcodeController;
