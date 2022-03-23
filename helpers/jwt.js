const expressJwt = require('express-jwt');

function authJwt() {
   const secret = process.env.secret;
   const api = process.env.API_URL;

   return expressJwt({
      secret,
      algorithms: ['HS256'],
   }).unless({
      path: [{
            url: /\/api\/v1\/products(.*)/, //to exclude get products and make user able to view them wethout auth
            methods: ['GET', 'OPTIONS']
         },
         {
            url: /\/api\/v1\/categories(.*)/,
            methods: ['GET', 'OPTIONS']
         },
         `${api}/users/login`, //to make user able to login again
         `${api}/users/register`, //to make user able to register
      ]
   });
}

module.exports = authJwt;