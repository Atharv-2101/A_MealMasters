const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')
const router = express.Router()

//  1. add subscriptionplan according to tiffin id
router.post('/addSubscriptionPlan', (req, res) => {

    if (req.user.role !== 'vendor') {
        return res.send(result.createResult("Access Denied"));
    }

    const user_id = req.user.uid;
    const { tiffin_id, plan_type, price, duration_days, meals_per_day } = req.body;

    // get vendor_id
    const sql =
        `SELECT vendor_id FROM vendors_details WHERE user_id = ?`;

    pool.query(sql, [user_id], (err, vendorData) => {

        if (vendorData.length === 0)
            return res.send(result.createResult("Vendor not found"));

        const vendor_id = vendorData[0].vendor_id;

        // check tiffin belongs to vendor
        const sql1 =
            `SELECT * FROM tiffin WHERE tiffin_id = ? AND vendor_id = ?`;

        pool.query(sql1, [tiffin_id, vendor_id], (err2, tiffinData) => {

            if (tiffinData.length === 0)
                return res.send(result.createResult("Invalid tiffin"));

            const sql2 = `
                INSERT INTO subscription_plans
                (tiffin_id, vendor_id, plan_type, price, duration_days, meals_per_day)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            pool.query(
                sql2,
                [
                    tiffin_id,
                    vendor_id,
                    plan_type,
                    price,
                    duration_days,
                    meals_per_day || 1
                ],
                (err3, data) => {
                    res.send(result.createResult(err3, "Subscription plan added"));
                }
            );
        });
    });
});

// 2. get subscription plans according to tiffin id
router.get('/getSubscriptionPlans/:tiffin_id', (req, res) => {
    const { tiffin_id } = req.params;

    // Remove "AND is_active = TRUE"
    const sql = `
        SELECT plan_id, plan_type, price, duration_days, meals_per_day
        FROM subscription_plans
        WHERE tiffin_id = ?
    `;

    pool.query(sql, [tiffin_id], (err, data) => {
        res.send(result.createResult(err, data));
    });
});


// 3. update subscription plan according to plan id
router.put('/updateSubscriptionPlan', (req, res) => {

    // Only vendor allowed
    if (req.user.role !== 'vendor') {
        return res.send(result.createResult("Access Denied"));
    }

    const user_id = req.user.uid;
    const {
        plan_id,
        plan_type,
        price,
        duration_days,
        meals_per_day
    } = req.body;

    // Step 1: Get vendor_id from token user
    const sql =
        `SELECT vendor_id FROM vendors_details WHERE user_id = ?`;

    pool.query(sql, [user_id], (err, vendorData) => {

        if (vendorData.length == 0) {
            return res.send(result.createResult("Vendor not found"));
        }

        const vendor_id = vendorData[0].vendor_id;

        // Step 2: Update only vendor's own plan
        const sql1 = `
            UPDATE subscription_plans
            SET plan_type = ?,
                price = ?,
                duration_days = ?,
                meals_per_day = ?
            WHERE plan_id = ?
              AND vendor_id = ?
        `;

        pool.query(
            sql1,
            [
                plan_type,
                price,
                duration_days,
                meals_per_day,
                plan_id,
                vendor_id
            ],
            (err2, data) => {

                if (data.affectedRows == 0) {
                    return res.send(
                        result.createResult("No plan updated (invalid plan or ownership)")
                    );
                }

                res.send(result.createResult(null, "Subscription plan updated"));
            }
        );
    });
});


// 4.delete subscription plan 
router.delete('/deleteSubscriptionPlan', (req, res) => {

    // Only vendor allowed
    if (req.user.role !== 'vendor') {
        return res.send(result.createResult("Access Denied"));
    }

    const user_id = req.user.uid;
    const { plan_id } = req.body;

    // Step 1: get vendor_id from token user
    const sql =
        `SELECT vendor_id FROM vendors_details WHERE user_id = ?`;

    pool.query(sql, [user_id], (err, vendorData) => {

        if (vendorData.length == 0) {
            return res.send(result.createResult("Vendor not found"));
        }

        const vendor_id = vendorData[0].vendor_id;

        // Step 2: delete only vendor's own plan
        const sql1 = `
            DELETE FROM subscription_plans
            WHERE plan_id = ? AND vendor_id = ?
        `;

        pool.query(
            sql1,
            [plan_id, vendor_id],
            (err2, data) => {

                if (data.affectedRows == 0) {
                    return res.send(
                        result.createResult("No plan deleted (invalid plan or ownership)")
                    );
                }

                res.send(result.createResult(null, "Subscription plan deleted"));
            }
        );
    });
});



module.exports=router