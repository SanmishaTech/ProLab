const Barcode = require("../Schema/branch");
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
      const usertobefound = mongoose.Types.ObjectId(userId);
      const findbranch = await find({
        userId: usertobefound,
      });
      if (findbranch.length > 0) {
        const branchUpdated = await Barcode.findByIdAndUpdate(
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
        return res
          .status(200)
          .json({ message: "Branch updated successfully.", branch: branch });
      }

      const newbarcode = new Barcode({
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
        message: "Barcode created successfully",
        service: newBarcode,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const usertobefound = mongoose.Types.ObjectId(userId);
      const barcode = await Barcode.find({ userId: usertobefound });

      res.status(200).json(barcode);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const barcodeID = req.params.barcodeId;
      const barcode = await Barcode.findById(barcodeID);
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
      const barcode = await Barcode.findByIdAndUpdate(
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
        return res.status(404).json({ message: "Barcode not found." });
      }

      res.json({ message: "barcode updated successfully.", barcode });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = barcodeController;
