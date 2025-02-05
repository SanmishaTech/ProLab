var express = require("express");
var router = express.Router();
const Usercontroller = require("../controller/usercontroller");
const { isAuthenticated } = require("../Middlewares/Auth");
/* GET users listing. */

router.post("/user/register", Usercontroller.Register);
router.get("/specificuser/get", isAuthenticated, Usercontroller.Getuser);
router.get("/specificuser/oneuser/:userId", Usercontroller.Getuserbyid);
router.post("/user/login", Usercontroller.Login);
router.get("/user/allusers", Usercontroller.GetAllusers);

module.exports = router;
