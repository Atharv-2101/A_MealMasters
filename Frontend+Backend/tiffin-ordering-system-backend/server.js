
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT;


const authorizeUser = require('./authorization/authuser')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const customerRouter = require('./routes/customer')
const vendorRouter = require('./routes/vendor')
const subscriptionRouter = require('./routes/subscriptionplan')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use('/profile_images', express.static('uploads/profile_images'));

/* ================= PUBLIC ROUTES (NO TOKEN) ================= */

app.use(authorizeUser)
app.use('/user', userRouter)        // login, signup
app.use('/customer', customerRouter) // customer/signup

/* ================= PROTECTED ROUTES (TOKEN REQUIRED) ================= */
app.use('/admin', adminRouter)
app.use('/vendor', vendorRouter)
app.use('/subscription', subscriptionRouter)

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ', PORT)
})