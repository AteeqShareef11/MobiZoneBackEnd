const express = require("express");
const { Product } = require("../models/product");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const { isAdmin } = require("../middleware/auth");

//Create a product

router.post("/", isAdmin, async (req, res) => {
  const { name, brand, desc, price, ram, rom, battery, camera, image } =
    req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "online-shop",
      });

      if (uploadRes) {
        const product = new Product({
          name,
          brand,
          desc,
          ram,
          rom,
          battery,
          camera,
          price,
          image: uploadRes,
        });
        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/adminProducts", async (req, res) => {
  const page = req.query.page || 1;
  let limit = req.query.limit || 6;
  const skip = (page - 1) * limit;
  try {
    const products = await Product.find().limit(limit).skip(skip);
    const total = await Product.count();
    res.status(200).send({ products, total });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/getproducts/bybrand", async (req, res) => {
  const page = req.query.page || 1;
  let limit = req.query.limit || 6;
  const skip = (page - 1) * limit;

  const { brand } = req.query;
  console.log(limit)
  console.log(page);

  try {
    const products = await Product.find({
      brand: brand,
    })
      .limit(limit)
      .skip(skip);
    const total = await Product.count({
      brand: brand,
    });
    return res.status(200).json({ products, total });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/getproducts/bybrand/byPriceRange", async (req, res) => {
  try {
    const { brand, minPrice, maxPrice } = req.query;

    const products = await Product.find({
      $and: [
        { brand: brand },
        {
          $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }],
        },
      ],
    });

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/getproducts/bybrand/byRamRanges", async (req, res) => {
  try {
    const { brand, ram } = req.query;
    console.log(brand, ram);

    const products = await Product.find({
      brand: brand,
      ram: ram,
    });

    console.log(products);
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/getproducts/bybrand/byRomRanges", async (req, res) => {
  try {
    const { brand, rom } = req.query;
    console.log(brand, rom);

    const products = await Product.find({
      brand: brand,
      rom: rom,
    });

    console.log(products);
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/getproducts/byPriceRange", async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    const products = await Product.find({
      $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }],
    });

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/getproducts/byName", async (req, res) => {
  try {
    const { name } = req.query;

    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/deleteProduct", async (req, res) => {
  try {
    const { id } = req.query;

    const products = await Product.findOneAndDelete({ _id: id });
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.post("/updateProduct", async (req, res) => {

  const { id } = req.query;
    console.log(id)
    const { name, brand, desc, price, ram, rom, battery, camera, image } = req.body;
    console.log(name, brand, desc, price, ram, rom, battery, camera, image )

  

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "online-shop",
      });

      if (uploadRes) {

          
          const filter = { _id:id };
          const update = {
            name: name,
            brand: brand,
            desc: desc,
            price: price,
            ram: ram,
            rom: rom,
            battery: battery,
            camera: camera,
            image: uploadRes,
          };
      
          const products = await Product.findOneAndUpdate( filter, update );
          return res.status(200).json({ products }); 

        }
      }

    
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/byName", async (req, res) => {


  let limit = req.query.limit || 3;
  

  try {
    const { name } = req.query;

    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    }).limit(limit)
   
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

// router.get("/getproducts/byAll", async (req, res) => {
//   try {
//     let { rom, minPrice, maxPrice, brand, ram } = req.query;
//     minPrice = Number(minPrice)
//     maxPrice =Number(maxPrice)
//     let obj = {};
//     if (brand) {
//       obj = { brand: brand };
//     }
//    if (minPrice) {
//       obj = {
//         ...obj,

//         $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }],
//       };
//     }
//     if (ram) {
//       obj = { ...obj, ram: ram };
//     }
//     if (rom) {
//       obj = { ...obj, rom: rom };
//     }
//     if (brand) {
//       obj = { brand: brand };
//     }

//     console.log("obj", obj);

//     const products = await Product.find(obj);
//     console.log("products", products);
//     return res.status(200).json({ products });
//   } catch (error) {
//     return res.status(500).json({ msg: error.message });
//   }
// });

module.exports = router;
