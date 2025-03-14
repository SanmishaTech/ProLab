var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const AWS = require("aws-sdk");
const multer = require("multer");

var usersRouter = require("./routes/users");
// var serverRoutes = require("./routes/serverRoutes");
// var channelRoutes = require("./routes/channelRoutes");
// var chatRoutes = require("./routes/chatRoute");
var ServiceRoutes = require("./routes/serviceRoutes");
// var ReferenceRoutes = require("./routes/referenceRoutes");
var RegistrationRoutes = require("./routes/Registration");
var HolidayRoutes = require("./routes/holidayRoutes");
var DepartmentRoutes = require("./routes/departmentRoutes");
var ParameterRoutes = require("./routes/parameterRoutes");
var ParameterGroupRoutes = require("./routes/parameterGroup");
var SpecimenRoutes = require("./routes/specimenRoutes");
var ContainerRoutes = require("./routes/containerRoutes");
var TestMasterRoutes = require("./routes/TestMasterRoutes");
var TestLinkMaster = require("./routes/testlinkmasterRoutes");
var AssociateMaster = require("./routes/associateRoutes");
var TatMasterRoutes = require("./routes/tatMasterRoutes");
var ReasonMaster = require("./routes/reasonRoutes");
var BarcodeRoutes = require("./routes/barcodeRoutes");
var HighlighterRoutes = require("./routes/highlighterRoutes");
var PatientMasterRoutes = require("./routes/patientMasterRoutes");
var PromoCodeMasterRoutes = require("./routes/promoCodeMasterRoutes");
var MachineRoutes = require("./routes/machineRoutes");
var MachineLinkMaster = require("./routes/machineLinkMaster");
var ContainerLinkMaster = require("./routes/containerLinkMaster");
var HighlighterRoutes = require("./routes/highlighterRoutes");
var CorporateMaster = require("./routes/corporateRoutes");
var UserMaster = require("./routes/userMasterRoutes");
var DiscountMaster = require("./routes/discountRoutes");
var RoleMaster = require("./routes/roleMasterRoutes");
var PrefixRoutes = require("./routes/prefixRoutes");
var ServicePayable = require("./routes/servicePayableRoutes");
var LabmasterRoutes = require("./routes/labmasterRoutes");
var CollectionMaster = require("./routes/collectionMasterRoutes");
var WorkingHours = require("./routes/workingHours");
var samplecollection = require("./routes/sampleCollectionRoutes");
var referenceRange = require("./routes/referencerange");
var autocompleteRoutes = require("./routes/autocompleteRoutes");
var makercheckerRoutes = require("./routes/makercheckerRoutes");
var associatetypeRoutes = require("./routes/associatetypeRoutes");
var medicationhistoryRoutes = require("./routes/medicationhistoryRoutes");
var branchsetupRoutes = require("./routes/branchRoutes");
var clinicHistoryRoutes = require("./routes/clientHistoryRoutes");
var templateRoutes = require("./routes/templateRoutes");
var paymentmodeRoutes = require("./routes/paymentmode");
var unitmasterRoutes = require("./routes/unitmaster");
var ratecardRoutes = require("./routes/ratecardRoutes");

var app = express();
const corsOptions = {
  origin: "*", // Specify the origin of your frontend application
  credentials: true, // This allows cookies and credentials to be included in the requests
};
app.use(cors(corsOptions));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", usersRouter);
// app.use("/api/server", serverRoutes);
// app.use("/api/channel", channelRoutes);
// app.use("/api/chats", chatRoutes);
app.use("/api/services", ServiceRoutes);
// app.use("/api/reference", ReferenceRoutes);
app.use("/api/registration", RegistrationRoutes);
app.use("/api/department", DepartmentRoutes);
app.use("/api/holiday", HolidayRoutes);
app.use("/api/parameter", ParameterRoutes);
app.use("/api/parametergroup", ParameterGroupRoutes);
app.use("/api/specimen", SpecimenRoutes);
app.use("/api/container", ContainerRoutes);
app.use("/api/testmaster", TestMasterRoutes);
app.use("/api/testmasterlink", TestLinkMaster);
app.use("/api/associatemaster", AssociateMaster);
app.use("/api/tatmaster", TatMasterRoutes);
app.use("/api/reason", ReasonMaster);
app.use("/api/barcode", BarcodeRoutes);
app.use("/api/highlighter", HighlighterRoutes);
app.use("/api/patientmaster", PatientMasterRoutes);
app.use("/api/promocodemaster", PromoCodeMasterRoutes);
app.use("/api/machinemaster", MachineRoutes);
app.use("/api/machinelinkmaster", MachineLinkMaster);
app.use("/api/containerlinkmaster", ContainerLinkMaster);
app.use("/api/corporatemaster", CorporateMaster);
app.use("/api/usermaster", UserMaster);
app.use("/api/discountmaster", DiscountMaster);
app.use("/api/rolemaster", RoleMaster);
app.use("/api/prefix", PrefixRoutes);
app.use("/api/service", ServicePayable);
app.use("/api/labmaster", LabmasterRoutes);
app.use("/api/collectionmaster", CollectionMaster);
app.use("/api/workinghours", WorkingHours);
app.use("/api/samplecollection", samplecollection);
app.use("/api/referencerange", referenceRange);
app.use("/api/autocomplete", autocompleteRoutes);
app.use("/api/makerchecker", makercheckerRoutes);
app.use("/api/associatetype", associatetypeRoutes);
app.use("/api/medicationhistory", medicationhistoryRoutes);
app.use("/api/branchsetup", branchsetupRoutes);
app.use("/api/clinic", clinicHistoryRoutes);
app.use("/api/template", templateRoutes);
app.use("/api/paymentmode", paymentmodeRoutes);
app.use("/api/unitmaster", unitmasterRoutes);
app.use("/api/ratecard", ratecardRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});
// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send the error as JSON response
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});
module.exports = app;
