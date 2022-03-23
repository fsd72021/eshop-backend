const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

require('dotenv/config');

//to prevent error 'cors origin'
app.use(cors());
app.options('*', cors());

//middlewares
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

//routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

//variables
const api = process.env.API_url;

//uses
app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)

//Database
mongoose.connect(process.env.CONNECTION_STRING, {})
   .then(() => {
      console.log('Database connection done...');
   })
   .catch((err) => {
      console.log(err);
   })

//Server
app.listen(3000, () => {
   console.log(api);
   console.log(`server is running on http://localhost:3000`);
})