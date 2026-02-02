const express = require('express')
const multer = require('multer')
const fs = require('fs')
const pool = require('../utils/db')
const result = require('../utils/result')
const auth = require('../authorization/authuser')
const router = express.Router()

const upload = multer({ dest: 'profileimages' })

router.use(auth)

router.get('/profile', (req, res) => {
    const userId = req.user.uid;
    // Querying the main users table for customer details
    pool.query('SELECT name, phone, address FROM users WHERE id = ?', [userId], (err, data) => {
        if (err) return res.send(result.createResult(err));
        res.send(result.createResult(null, data[0]));
    });
});

router.put('/updateProfile', (req, res) => {
    // Security Check
    if (req.user.role !== 'customer') {
        return res.send(result.createResult("Access Denied"));
    }

    const userId = req.user.uid;
    const { name, phone, address } = req.body;

    // Validation
    if (!name || !phone) {
        return res.send(result.createResult("Name and Phone are required"));
    }

    // Update the users table
    // Note: We update the address here assuming you added the 'address' column to the users table
    const sql = `
        UPDATE users 
        SET name = ?, phone = ?, address = ? 
        WHERE id = ?
    `;

    pool.query(sql, [name, phone, address, userId], (err, data) => {
        if (err) {
            return res.send(result.createResult(err));
        }

        if (data.affectedRows === 0) {
            return res.send(result.createResult("User not found"));
        }

        res.send(result.createResult(null, "Profile updated successfully"));
    });
});


router.post('/address/add', (req, res) => {
    if (req.user.role !== 'customer')
        return res.send(result.createResult("Access Denied"))

    const { address, pincode, city, district, state } = req.body
    const userId = req.user.uid

    if (!address || !pincode)
        return res.send(result.createResult("Address and pincode are required"))

    const sql = `
    INSERT INTO address_details 
    (user_id, address, pincode, city, district, state)
    VALUES (?, ?, ?, ?, ?, ?)
  `

    pool.query(
        sql,
        [userId, address, pincode, city, district, state],
        (err, data) => {
            if (err)
                return res.send(result.createResult(err))

            res.send(result.createResult(null, "Address added successfully"))
        }
    )
})


// 1.Customer View All Tiffins
router.get('/tiffinsList', auth, (req, res) => {

    if (!req.user || req.user.role !== 'customer') {
        return res.send(result.createResult("Access Denied"));
    }

    const sql = `
        SELECT 
            t.tiffin_id,
            t.title,
            t.type,
            t.description,
            t.cost,
            t.image,
            v.vendor_id,
            v.business_name
        FROM tiffin t
        JOIN vendors_details v 
            ON t.vendor_id = v.vendor_id
    `;

    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data));
    });
});



// 2. View subscription plans of all Tiffins
router.get('/tiffinPlans/:tiffin_id', (req, res) => {


    if (req.user.role !== 'customer') {
        return res.send(result.createResult("Access Denied"));
    }

    const { tiffin_id } = req.params;

    const sql = `
        SELECT 
            plan_id,
            plan_type,
            price,
            duration_days,
            meals_per_day
        FROM subscription_plans
        WHERE tiffin_id = ?
    `;

    pool.query(sql, [tiffin_id], (err, data) => {
        res.send(result.createResult(err, data));
    });
});

// 3.place tiffin order
router.post('/placeOrder', (req, res) => {

    if (req.user.role !== 'customer') {
        return res.send(result.createResult("Access Denied"));
    }

    const customer_id = req.user.uid;
    const { tiffin_id, plan_id, start_date } = req.body;

    const sql = `
        SELECT s.vendor_id, s.duration_days
        FROM subscription_plans s
        WHERE s.plan_id = ? AND s.tiffin_id = ?
    `;

    pool.query(sql, [plan_id, tiffin_id], (err, data) => {

        if (data.length === 0)
            return res.send(result.createResult("Invalid plan"));

        const vendor_id = data[0].vendor_id;
        const duration = data[0].duration_days;

        const insertSQL = `
            INSERT INTO customer_tiffin_orders
            (customer_id, vendor_id, tiffin_id, plan_id, start_date, end_date, status)
            VALUES (?, ?, ?, ?, ?, DATE_ADD(?, INTERVAL ? DAY), 'PENDING')
        `;

        pool.query(
            insertSQL,
            [customer_id, vendor_id, tiffin_id, plan_id, start_date, start_date, duration],
            (err2) => {
                res.send(result.createResult(err2, "Order placed"));
            }
        );
    });
});


// 4.display orderHistory 
router.get('/orderHistory', (req, res) => {

    if (req.user.role !== 'customer') {
        return res.send(result.createResult("Access Denied"));
    }

    const customer_id = req.user.uid;

    const sql = `
        SELECT 
            o.order_id,
            o.start_date,
            o.end_date,
            o.status,
            t.title AS tiffin_name,
            t.image,
            v.business_name,
            s.plan_type,
            s.duration_days,
            s.price
        FROM customer_tiffin_orders o
        JOIN tiffin t ON o.tiffin_id = t.tiffin_id
        JOIN vendors_details v ON o.vendor_id = v.vendor_id
        JOIN subscription_plans s ON o.plan_id = s.plan_id
        WHERE o.customer_id = ?
        ORDER BY o.created_at DESC
    `;

    pool.query(sql, [customer_id], (err, data) => {
        if (err) {
            return res.send(result.createResult(err));
        }

        // ✅ No orders placed
        if (data.length === 0) {
            return res.send(result.createResult(
                null,
                "No orders placed yet"
            ));
        }

        res.send(result.createResult(null, data));
    });
});



// 5. TO GET SINGLE ORDER

router.get('/order/:orderId', (req, res) => {
    if (req.user.role !== 'customer')
        return res.send(result.createResult("Access Denied"))

    const sql = `
    SELECT *
    FROM customer_tiffin_orders
    WHERE order_id=? AND customer_id=?
  `

    pool.query(sql, [req.params.orderId, req.user.uid], (err, data) => {
        res.send(result.createResult(err, data[0]))
    })
})


// 6. TO CANCEL THE ORDER (POSSIBLE ONLY IF status = 'PENDING')

router.put('/order/:orderId/cancel', (req, res) => {
    if (req.user.role !== 'customer')
        return res.send(result.createResult("Access Denied"))

    const sql = `
    UPDATE customer_tiffin_orders
    SET status='CANCELLED'
    WHERE order_id=? AND customer_id=? AND status='PENDING'
  `

    pool.query(sql, [req.params.orderId, req.user.uid], (err, data) => {
        if (data.affectedRows === 0)
            return res.send(result.createResult("Cannot cancel this order"))

        res.send(result.createResult(null, "Order Cancelled"))
    })
})


// 7. GET DELIVERY DETAILS FOR ORDER

router.get('/order/:id/delivery', (req, res) => {
    if (req.user.role !== 'customer')
        return res.send(result.createResult("Access Denied"))

    const sql = `
    SELECT 
      d.name,
      d.mobile,
      o.status,
      o.start_date,
      o.end_date
    FROM customer_tiffin_orders o
    JOIN delivery d ON o.delivery_id = d.delivery_id
    WHERE o.order_id = ? AND o.customer_id = ?`

    pool.query(sql, [req.params.id, req.user.uid], (err, data) => {
        res.send(result.createResult(err, data[0]))
    })
})


module.exports = router
