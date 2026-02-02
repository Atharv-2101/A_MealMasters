// const jwt = require("jsonwebtoken");
// const result = require("../utils/result");
// const config = require("../configuration/config");

// function authorizeUser(req, res, next) {
//   const url = req.url;

//   // Public routes
//   if (
//     url.includes("/signin") ||
//     url.includes("/signup")
//   ) {
//     return next();
//   }

//   // Read Authorization header
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.send(result.createResult("Token is Missing"));
//   }

//   // Expect: Bearer <token>
//   const token = authHeader.split(" ")[1];

//   if (!token) {
//     return res.send(result.createResult("Invalid Token Format"));
//   }

//   try {
//     const payload = jwt.verify(token, config.SECRET);

//     req.user = {
//       uid: payload.uid,
//       role: payload.role,
//     };

//     next();
//   } catch (err) {
//     return res.send(result.createResult("Invalid Token"));
//   }
// }

// module.exports = authorizeUser;


const jwt = require('jsonwebtoken')
const result = require('../utils/result')
const config = require('../configuration/config')

function authorizeUser(req, res, next) {

  // ✅ EXACT public routes
  const publicRoutes = [
    '/user/signin',
    '/user/customer/signup',
    '/user/vendor/signup',
    '/user/admin/signup'
  ]

  // ✅ MUST USE originalUrl
  if (publicRoutes.includes(req.originalUrl)) {
    return next()
  }

  const token = req.headers.token

  if (!token) {
    return res.status(401).send(
      result.createResult('Token is Missing')
    )
  }

  try {
    const payload = jwt.verify(token, config.SECRET)

    // ✅ THIS WAS MISSING EARLIER
    req.user = {
      uid: payload.uid,
      role: payload.role
    }

    next()
  } catch (err) {
    return res.status(401).send(
      result.createResult('Invalid Token')
    )
  }
}

module.exports = authorizeUser