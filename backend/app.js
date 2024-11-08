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
var PatientRoutes = require("./routes/patientRoutes");
var ReferenceRoutes = require("./routes/referenceRoutes");
var RegistrationRoutes = require("./routes/Registration");
var HolidayRoutes = require("./routes/holidayRoutes");
var DepartmentRoutes = require("./routes/departmentRoutes");
var ParameterRoutes = require("./routes/parameterRoutes");
var ParameterGroupRoutes = require("./routes/parameterGroup");
var SpecimenRoutes = require("./routes/specimenRoutes");
var ContainerRoutes = require("./routes/containerRoutes");
var TestMasterRoutes = require("./routes/TestMasterRoutes");
var TestLinkMaster = require("./routes/testlinkmasterRoutes");

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
app.use("/api/patients", PatientRoutes);
app.use("/api/reference", ReferenceRoutes);
app.use("/api/registration", RegistrationRoutes);
app.use("/api/department", DepartmentRoutes);
app.use("/api/holiday", HolidayRoutes);
app.use("/api/parameter", ParameterRoutes);
app.use("/api/parametergroup", ParameterGroupRoutes);
app.use("/api/specimen", SpecimenRoutes);
app.use("/api/container", ContainerRoutes);
app.use("/api/testmaster", TestMasterRoutes);
app.use("/api/testmasterlink", TestLinkMaster);

app.use(express.static(path.join(__dirname, "./dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./dist/index.html"));
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
