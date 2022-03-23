const {
   Product
} = require('../models/product');
const {
   Category
} = require('../models/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//get all products
router.get('/', async (req, res) => {
   let filter = {};
   if(req.query.categories) {
      filter = { category: req.query.categories.split(',') };
   }
   const productList = await Product.find(filter).populate('category'); //filter products by category
   // const productList = await Product.find(filter).select('title image -_id').populate('category'); //return only title and image and hidden id

   if (!productList) {
      res.status(500).json({
         success: false
      })
   }

   res.send(productList)
})

//get single product
router.get('/:id', async (req, res) => {
   const product = await Product.findById(req.params.id).populate('category');

   if (!product) {
      return res.status(404).json({
         success: false,
         message: 'product not found'
      });
   }

   res.status(200).send(product);
})

//create product
router.post('/', async (req, res) => {
   const category = await Category.findById(req.body.category);
   if (!category) return res.status(400).send('invalid category')

   const product = new Product({
      title: req.body.title,
      description: req.body.description,
      details: req.body.details,
      image: req.body.image,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      reviewsNum: req.body.reviewsNum,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated,
   })
   await product.save();

   if (!product)
      return res.status(404).send('cannot create product');

   res.send(product)
})

//update single product
router.put('/:id', async (req, res) => {
   if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send('invalid category id');
   }
   const category = await Category.findById(req.body.category);
   if (!category) return res.status(400).send('invalid category')

   const product = await Product.findByIdAndUpdate(
      req.params.id, {
         title: req.body.title,
         description: req.body.description,
         details: req.body.details,
         image: req.body.image,
         images: req.body.images,
         brand: req.body.brand,
         price: req.body.price,
         category: req.body.category,
         countInStock: req.body.countInStock,
         rating: req.body.rating,
         reviewsNum: req.body.reviewsNum,
         isFeatured: req.body.isFeatured,
         dateCreated: req.body.dateCreated,
      }, {
         new: true
      }
   );

   if (!product)
      return res.status(500).send('cannot update product');

   res.send(product)
})

//delete product
router.delete('/:id', (req, res) => {
   if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send('invalid product id');
   }
   Product.findByIdAndRemove(req.params.id).then(product => {
      if (product) {
         return res.status(200).json({
            success: true,
            message: 'product deleted successfully'
         });
      } else {
         return res.status(404).json({
            success: false,
            message: 'product not found'
         });
      }
   }).catch(err => {
      return res.status(404).json({
         success: false,
         error: err
      })
   })
})

//get products count
router.get('/get/count', async (req, res) => {
   const productsCount = await Product.countDocuments();

   if (!productsCount) {
      res.status(500).json({
         success: false
      })
   }

   res.send({
      productsCount: productsCount
   })
})

//get featured products
router.get('/get/featured/:count', async (req, res) => {
   const count = req.params.count ? req.params.count : 0;
   const products = await Product.find({isFeatured: true}).limit(+count); //plus to make count be Number

   if (!products) {
      res.status(500).json({
         success: false
      })
   }

   res.send(products)
})

module.exports = router;