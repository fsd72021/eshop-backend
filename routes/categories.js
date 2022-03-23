const {
   Category
} = require('../models/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//get all categories
router.get('/', async (req, res) => {
   const categoryList = await Category.find();

   if (!categoryList) {
      res.status(500).json({
         success: false
      })
   }
   res.status(200).send(categoryList)
})

//get category
router.get('/:id', async (req, res) => {
   const category = await Category.findById(req.params.id);

   if (!category) {
      return res.status(404).json({
         success: false,
         message: 'category not found'
      });
   }

   res.status(200).send(category);
})

//create category
router.post('/', async (req, res) => {
   let category = new Category({
      title: req.body.title,
      icon: req.body.icon,
      color: req.body.color,
   })
   await category.save();

   if (!category)
      return res.status(404).send('cannot create category');

   res.send(category)
})

//update category
router.put('/:id', async (req, res) => {
   if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send('invalid category id');
   }
   const category = await Category.findByIdAndUpdate(
      req.params.id, {
         title: req.body.title,
         icon: req.body.icon,
         color: req.body.color,
      }, {
         new: true //to return the updated category not the old one
      }
   );

   if (!category)
      return res.status(400).send('cannot update category');

   res.send(category)
})

//delete category
router.delete('/:id', (req, res) => {
   if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send('invalid category id');
   }
   Category.findByIdAndRemove(req.params.id).then(category => {
      if (category) {
         return res.status(200).json({
            success: true,
            message: 'category deleted successfully'
         });
      } else {
         return res.status(404).json({
            success: false,
            message: 'category not found'
         });
      }
   }).catch(err => {
      return res.status(404).json({
         success: false,
         error: err
      })
   })
})

module.exports = router;