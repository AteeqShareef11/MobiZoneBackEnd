const express = require("express");
const { User } = require("../models/user");
const router = express.Router();



router.get("/user", async (req, res) => {
 
  const page = req.query.page || 1;
  let limit = req.query.limit || 7;
  const skip = (page - 1) * limit;

    try {
      const users = await User.find()
      .limit(limit)
      .skip(skip);;
      const total = await User.count();
      res.status(200).send({users,total})
  

    
      console.log(users)
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error);
    }
  });


  router.get("/deleteUser", async (req, res) => {
    try {
      const { id } = req.query;
  
      const users = await User.findOneAndDelete({ _id: id });
      return res.status(200).json(users);
      
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  });


  module.exports = router;