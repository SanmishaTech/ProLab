var mongoose = require("mongoose");
require("dotenv").config();
var app = require("./app");
var debug = require("debug")("backend:server");
var http = require("http");
var { Server } = require("socket.io");
var Socketsetup = require("./Socket");
const cors = require("cors");

const mongoDBURI = process.env.MONGODB_URI;
if (!mongoDBURI) {
  console.error("Missing MONGODB_URI in environment. Create backend/.env with MONGODB_URI=... and restart the server.");
  process.exit(1);
}
mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

var port = normalizePort(process.env.PORT || "3000");
// app.set("port", port);

// var server = http.createServer(app);
const server = app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});
// server.listen(port);

server.on("error", onError);
server.on("listening", onListening);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
  cookie: true,
});

// Socketsetup(io);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
