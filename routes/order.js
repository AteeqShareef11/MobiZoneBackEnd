const express = require("express");
const { Order } = require("../models/order");
const router = express.Router();



router.get("/order", async (req, res) => {
  const page = req.query.page || 1;
  let limit = req.query.limit || 3;
  const skip = (page - 1) * limit;
    try {
      const orders = await Order.find()
      .limit(limit)
      .skip(skip);;
      const total = await Order.count();;
      res.status(200).send({orders,total});
      console.log(orders)
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error);
    }
  });


  router.post("/orderStatusUpdate", async (req, res) => {
    
    const { id , item } = req.query;
    
    try {
      console.log("item",item)
      const filter = { _id:id };
      const update = {orderStatus_status:item};
      const orders = await Order.findOneAndUpdate( filter, update );
      res.status(200).send(orders);
      console.log(orders)
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error);
    }
  });


  module.exports = router;