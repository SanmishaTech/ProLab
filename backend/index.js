var mongoose = require("mongoose");
var app = require("./app");
var debug = require("debug")("backend:server");
var http = require("http");
var { Server } = require("socket.io");
var Socketsetup = require("./Socket");
const cors = require("cors");
require("dotenv").config();

const mongoDBURI =
  "mongodb+srv://yashc:yash123456@cluster0.xqys6ob.mongodb.net/lab?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

const ports = 3000;
var port = normalizePort(ports || "3000");
// app.set("port", port);

// var server = http.createServer(app);
const server = app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
// server.listen(port);

server.on("error", onError);
server.on("listening", onListening);
const io = new Server(server, {
  cors: {
    // origin: "https://www.yashportfoliohub.site",
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
