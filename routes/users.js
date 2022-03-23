const {
   User
} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//get all users
router.get('/', async (req, res) => {
   const userList = await User.find().select('name phone email');

   if (!userList) {
      res.status(500).json({
         success: false
      })
   }

   res.send(userList)
})

//create user
router.post('/register', async (req, res) => {
   let user = new User({
      name: req.body.name,
      email: req.body.email,
      hashedPassword: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
   })
   await user.save();

   if (!user)
      return res.status(404).send('cannot create user');

   res.send(user)
})

//update user
router.put('/:id', async (req, res) => {
   if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send('invalid user id');
   }
   const user = await User.findByIdAndUpdate(
      req.params.id, {
         name: req.body.name,
         email: req.body.email,
         hashedPassword: bcrypt.hashSync(req.body.password, 10),
         phone: req.body.phone,
         isAdmin: req.body.isAdmin,
         street: req.body.street,
         zip: req.body.zip,
         city: req.body.city,
         country: req.body.country,
      }, {
         new: true //to return the updated user not the old one
      }
   );

   if (!user)
      return res.status(400).send('cannot update user');

   res.send(user)
})


//get one user
router.get('/:id', async (req, res) => {
   const user = await User.findById(req.params.id).select('name phone email');

   if (!user) {
      return res.status(404).json({
         success: false,
         message: 'user not found'
      });
   }

   res.status(200).send(user);
})

//delete user
router.delete('/:id', (req, res) => {
   if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send('invalid user id');
   }
   User.findByIdAndRemove(req.params.id).then(user => {
      if (user) {
         return res.status(200).json({
            success: true,
            message: 'user deleted successfully'
         });
      } else {
         return res.status(404).json({
            success: false,
            message: 'user not found'
         });
      }
   }).catch(err => {
      return res.status(404).json({
         success: false,
         error: err
      })
   })
})

//login user
router.post('/login', async (req, res) => {
   const user = await User.findOne({
      email: req.body.email
   });
   const secret = process.env.secret;

   if (!user)
      return res.status(400).send('user not found');

   if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
      const token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin, //to prevent hackers to login dashboard as admins
         },
         secret,
         {
            expiresIn: '1d'
         }
      )
      res.status(200).send({
         email: user.email,
         token: token,
      })
   } else {
      res.status(400).send('password is wrong')
   }
})

module.exports = router;