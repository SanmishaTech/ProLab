const User = require("../Schema/userSchema");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/usertoken");
// const UserConversation = require("../Schema/Userconversation");

// async function updateOrCreateConversation(senderId, receiverId, directmessage) {
//   try {
//     // Ensure senderId and receiverId are stored in a consistent order
//     const userIds = [senderId, receiverId].sort();

//     // Find an existing conversation between these two users

//     let Schemadirectmessage = await Directmesagesboth.findOne({
//       users: { $all: userIds },
//     });
//     if (Schemadirectmessage) {
//       console.log("directmessage", directmessage._id);
//       await Schemadirectmessage.Messages.push(directmessage._id);
//       console.log("Directmessage updated :", Schemadirectmessage);
//       await Schemadirectmessage.save();
//     }
//     if (!Schemadirectmessage) {
//       Schemadirectmessage = new Directmesagesboth({
//         users: userIds,
//         lastMessageTimestamp: new Date(),
//       });
//       await Schemadirectmessage.Messages.push(directmessage._id);
//       await Schemadirectmessage.save();
//       console.log("Directmessage created:", Schemadirectmessage);
//     }

//     let conversation = await UserConversation.findOne({
//       users: { $all: userIds },
//     });

//     if (conversation) {
//       // If conversation exists, update the lastMessageTimestamp
//       conversation.lastMessageTimestamp = new Date();
//       await conversation.save();
//       console.log("Conversation updated :", conversation);
//     } else {
//       // If no conversation exists, create a new one
//       conversation = new UserConversation({
//         users: userIds,
//         lastMessageTimestamp: new Date(),
//       });
//       await conversation.save();
//       console.log("Conversation created:", conversation);
//     }
//   } catch (error) {
//     console.error("Error updating or creating conversation:", error);
//   }
// }
const Usercontroller = {
  Register: async (req, res, next) => {
    try {
      console.log("work");
      const { username, email, password } = req.body;
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = await User.create({ username, email, passwordHash });
      const token = generateToken(user);

      res.cookie("jwt", token, { httpOnly: true, SameSite: "none" });

      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  Login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Invalid Email or password" });
      }
      const validPassword = await bcrypt.compare(password, user.passwordHash);

      if (!validPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = generateToken(user);

      res.cookie("jwt", token, { httpOnly: true, sameSite: "Lax" }); // For local testing

      return res.json({ user, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Getuser: async (req, res, next) => {
    try {
      const userid = req.user._id;
      const user = await User.findById(userid);
      if (!user) {
        return res.status(401).json({ error: "Invalid User" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  Getuserbyid: async (req, res, next) => {
    try {
      const userid = req.params.userId;
      const user = await User.findById(userid);
      if (!user) {
        return res.status(401).json({ error: "Invalid User" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = Usercontroller;
