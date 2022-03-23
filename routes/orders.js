const { Orders } = require('../models/order');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
   const ordersList = await Orders.find();

   if (!ordersList) {
      res.status(500).json({
         success: false
      })
   }

   res.send(ordersList)
})

module.exports = router;