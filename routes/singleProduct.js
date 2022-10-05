const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");

router.get("/productdesc/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);

  try {
    const selectedProduct = await Product.findOne({ _id: id });
    res.status(200).send(selectedProduct);
    console.log(selectedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
