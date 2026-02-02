const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')
const router = express.Router()

const multer = require('multer');
const fs = require('fs');

// business image
// const businessUpload = multer({
//     dest: 'uploads/businessimages'
// });

// vendor profile image (if needed later)
const profileUpload = multer({
    dest: 'uploads/profile_images'
});

// tiffin image
const tiffinUpload = multer({
    dest: 'uploads/tiffin_images'
});



// 1.Create Vendor Profile - with details of business name,business description,business_image
// router.post('/createVendorProfile',profileUpload.single('image'),(req, res) => {

//         if (req.user.role !== 'vendor') {
//             return res.send(result.createResult("Access Denied"));
//         }

//         const user_id = req.user.uid;
//         const { business_name, business_description } = req.body;

//         const image = req.file.filename + ".jpg";
//         fs.rename(req.file.path, req.file.path + ".jpg", () => { });

//         const sql = `
//             INSERT INTO vendors_details (user_id, image, business_name, business_description)
//             VALUES (?, ?, ?, ?)
//         `;

//         pool.query(sql, [user_id, image, business_name, business_description], (err) => {
//             res.send(result.createResult(err, "Vendor profile created"));
//         });
//     });

router.post('/createVendorProfile', profileUpload.single('image'), (req, res) => {
    const user_id = req.user.uid;
    const { business_name, business_description } = req.body;
    let image = req.file ? req.file.filename + ".jpg" : null;

    if (req.file) {
        fs.rename(req.file.path, req.file.path + ".jpg", () => { });
    }

    // Use ON DUPLICATE KEY UPDATE so it updates existing profiles
    const sql = `
        INSERT INTO vendors_details (user_id, image, business_name, business_description)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            business_name = VALUES(business_name),
            business_description = VALUES(business_description),
            image = IFNULL(VALUES(image), image)
    `;

    pool.query(sql, [user_id, image, business_name, business_description], (err) => {
        res.send(result.createResult(err, "Profile Updated Successfully"));
    });
});

// 2.Add Meal 
// router.post('/addTiffin',tiffinUpload.single('image'),(req, res) => {

//         if (req.user.role !== 'vendor') {
//             return res.send(result.createResult("Access Denied"));
//         }

//         const user_id = req.user.uid;
//         const { title, type, description, cost } = req.body;

//         const image = req.file ? req.file.filename + ".jpg" : null;

//         if (req.file) {
//             fs.rename(req.file.path, req.file.path + ".jpg", () => { });
//         }

//         const sql =
//             `SELECT vendor_id FROM vendors_details WHERE user_id = ?`;

//         pool.query(sql, [user_id], (err, vendorData) => {
//             if (vendorData.length === 0)
//                 return res.send(result.createResult("Create vendor profile first"));

//             const vendor_id = vendorData[0].vendor_id;

//             const sql1 = `
//                 INSERT INTO tiffin
//                 (vendor_id, title, type, description, cost, image)
//                 VALUES (?, ?, ?, ?, ?, ?)
//             `;

//             pool.query(
//                 sql1,
//                 [vendor_id, title, type, description, cost, image],
//                 (err2) => {
//                     res.send(result.createResult(err2, "Tiffin added"));
//                 }
//             );
//         });
//     });

router.post('/addTiffin', tiffinUpload.single('image'), (req, res) => {
    if (req.user.role !== 'vendor') {
        return res.send(result.createResult("Access Denied"));
    }

    const user_id = req.user.uid;
    const { title, type, description, cost } = req.body;
    const baseCost = parseFloat(cost); // Ensure it's a number

    const image = req.file ? req.file.filename + ".jpg" : null;

    if (req.file) {
        fs.rename(req.file.path, req.file.path + ".jpg", () => { });
    }

    const sql = `SELECT vendor_id FROM vendors_details WHERE user_id = ?`;

    pool.query(sql, [user_id], (err, vendorData) => {
        if (err) return res.send(result.createResult(err));
        if (vendorData.length === 0)
            return res.send(result.createResult("Create vendor profile first"));

        const vendor_id = vendorData[0].vendor_id;

        const sql1 = `
            INSERT INTO tiffin
            (vendor_id, title, type, description, cost, image)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        pool.query(
            sql1,
            [vendor_id, title, type, description, baseCost, image],
            (err2, tiffinResult) => {
                if (err2) return res.send(result.createResult(err2));

                // Get the newly created Tiffin ID
                const newTiffinId = tiffinResult.insertId;

                // Define 3 default plans: Daily, Weekly (5% off), Monthly (10% off)
                const defaultPlans = [
                    [newTiffinId, vendor_id, 'DAILY', baseCost, 1, 1],
                    [newTiffinId, vendor_id, 'WEEKLY', (baseCost * 7 * 0.95).toFixed(2), 7, 1],
                    [newTiffinId, vendor_id, 'MONTHLY', (baseCost * 30 * 0.90).toFixed(2), 30, 1]
                ];

                const sqlPlans = `
                    INSERT INTO subscription_plans 
                    (tiffin_id, vendor_id, plan_type, price, duration_days, meals_per_day) 
                    VALUES ?
                `;

                // Use the bulk insert syntax [defaultPlans]
                pool.query(sqlPlans, [defaultPlans], (err3) => {
                    if (err3) {
                        console.error("Failed to add default plans:", err3);
                        return res.send(result.createResult(null, "Tiffin added, but plans failed"));
                    }
                    res.send(result.createResult(null, "Tiffin and default plans added successfully"));
                });
            }
        );
    });
});



// 3.Update tiffin
router.put('/updateTiffin', (req, res) => {

    if (req.user.role !== 'vendor') {
        return res.send(result.createResult("Access Denied"));
    }

    const user_id = req.user.uid;
    const { tiffin_id, title, type, description, cost } = req.body;

    // Step 1: get vendor_id
    const vendorSQL =
        `SELECT vendor_id FROM vendors_details WHERE user_id = ?`;

    pool.query(vendorSQL, [user_id], (err, vendorData) => {

        if (vendorData.length === 0) {
            return res.send(result.createResult("Vendor not found"));
        }

        const vendor_id = vendorData[0].vendor_id;

        // Step 2: update tiffin (NO image)
        const updateSQL = `
            UPDATE tiffin
            SET title = ?, type = ?, description = ?, cost = ?
            WHERE tiffin_id = ? AND vendor_id = ?
        `;

        pool.query(
            updateSQL,
            [title, type, description, cost, tiffin_id, vendor_id],
            (err2, data) => {
                res.send(result.createResult(err2, "Tiffin updated"));
            }
        );
    });
});


// 4.delete tiffin
router.delete('/deleteTiffin', (req, res) => {

    if (req.user.role !== 'vendor') {
        return res.send(result.createResult("Access Denied"));
    }

    const user_id = req.user.uid;
    const { tiffin_id } = req.body;

    const sql =
        `SELECT vendor_id FROM vendors_details WHERE user_id = ?`;

    pool.query(sql, [user_id], (err, vendorData) => {
        if (vendorData.length === 0)
            return res.send(result.createResult("Vendor not found"));

        const vendor_id = vendorData[0].vendor_id;

        const sql1 =
            `DELETE FROM tiffin WHERE tiffin_id = ? AND vendor_id = ?`;

        pool.query(sql1, [tiffin_id, vendor_id], (err2, data) => {
            res.send(result.createResult(err2, "Tiffin deleted"));
        });
    });
});


// 5.get all tiffin details
// router.get('/getTiffinDetails', (req, res) => {
//     const sql = `
//         SELECT 
//             f.tiffin_id,
//             f.title,
//             f.type,
//             f.description,
//             f.cost,
//             f.image,

//             v.vendor_id,
//             v.business_name,
//             v.business_description

//         FROM tiffin f
//         INNER JOIN vendors_details v 
//         ON f.vendor_id = v.vendor_id
//         WHERE f.vendor_id = ?
//     `;
//     const vendor_id = vendorData[0].vendor_id;
//     pool.query(sql,[vendor_id], (err, data) => {
//         res.send(result.createResult(err, data))
//     })
// })
// 5.get all tiffin details
router.get('/getTiffinDetails', (req, res) => {
    // 1. Check if user is vendor
    if (req.user.role !== 'vendor') {
        return res.send(result.createResult("Access Denied"));
    }

    const user_id = req.user.uid;

    // 2. First, get the vendor_id from vendors_details
    const vendorIdSQL = `SELECT vendor_id FROM vendors_details WHERE user_id = ?`;

    pool.query(vendorIdSQL, [user_id], (err, vendorData) => {
        if (err) return res.send(result.createResult(err));
        
        if (vendorData.length === 0) {
            return res.send(result.createResult("Vendor profile not found"));
        }

        const vendor_id = vendorData[0].vendor_id;

        // 3. Now query the tiffins using that vendor_id
        const sql = `
            SELECT 
                f.tiffin_id, f.title, f.type, f.description, f.cost, f.image,
                v.vendor_id, v.business_name, v.business_description
            FROM tiffin f
            INNER JOIN vendors_details v ON f.vendor_id = v.vendor_id
            WHERE f.vendor_id = ?
        `;

        pool.query(sql, [vendor_id], (err2, data) => {
            res.send(result.createResult(err2, data));
        });
    });
});

// 6.Show the orders 
router.get('/orders', (req, res) => {

    if (req.user.role !== 'vendor') {
        return res.send(result.createResult("Access Denied"));
    }

    const user_id = req.user.uid;

    const vendorSQL =
        `SELECT vendor_id FROM vendors_details WHERE user_id = ?`;

    pool.query(vendorSQL, [user_id], (err, vendorData) => {

        if (vendorData.length === 0)
            return res.send(result.createResult("Vendor not found"));

        const vendor_id = vendorData[0].vendor_id;

        const sql = `
            SELECT 
                o.order_id,
                o.start_date,
                o.end_date,
                o.status,
                u.name AS customer_name,
                u.phone,
                t.title AS tiffin_name,
                s.plan_type
            FROM customer_tiffin_orders o
            JOIN users u ON o.customer_id = u.id
            JOIN tiffin t ON o.tiffin_id = t.tiffin_id
            JOIN subscription_plans s ON o.plan_id = s.plan_id
            WHERE o.vendor_id = ?
            ORDER BY o.created_at DESC
        `;

        pool.query(sql, [vendor_id], (err2, data) => {
            res.send(result.createResult(err2, data));
        });
    });
});

// 7.update order status
router.put('/updateOrderStatus', (req, res) => {

    if (req.user.role !== 'vendor') {
        return res.send(result.createResult("Access Denied"));
    }

    const user_id = req.user.uid;
    const { order_id, status } = req.body;

    const vendorSQL =
        `SELECT vendor_id FROM vendors_details WHERE user_id = ?`;

    pool.query(vendorSQL, [user_id], (err, vendorData) => {

        if (vendorData.length === 0)
            return res.send(result.createResult("Vendor not found"));

        const vendor_id = vendorData[0].vendor_id;

        const updateSQL = `
            UPDATE customer_tiffin_orders
            SET status = ?
            WHERE order_id = ? AND vendor_id = ?
        `;

        pool.query(updateSQL, [status, order_id, vendor_id], (err2, data) => {

            if (data.affectedRows === 0)
                return res.send(result.createResult("Invalid order"));

            res.send(result.createResult(null, "Order status updated"));
        });
    });
});


// 8. ASSIGN DELIVERY TO TIFFIN ORDER

router.put('/assignDelivery/:orderId', (req, res) => {
  if (req.user.role !== 'vendor')
    return res.send(result.createResult("Access Denied")) 

  const { delivery_id } = req.body 

  const sql = `
    UPDATE customer_tiffin_orders
    SET delivery_id=?, status='APPROVED'
    WHERE order_id=?` 

  pool.query(sql, [delivery_id, req.params.orderId], (err) => {
    if (err) return res.send(result.createResult(err)) 

    pool.query(
      `UPDATE delivery SET status='BUSY' WHERE delivery_id=?`,
      [delivery_id]
    ) 

    res.send(result.createResult(null, "Delivery Assigned")) 
  }) 
}) 

// 9. MARK TIFFIN AS DELIVERED

// router.put('/order/:id/delivered', (req, res) => {
//   if (req.user.role !== 'vendor')
//     return res.send(result.createResult("Access Denied")) 

//   pool.query(
//     `UPDATE customer_tiffin_orders SET status='DELIVERED' WHERE order_id=?`,
//     [req.params.id],
//     (err) => res.send(result.createResult(err, "Order Delivered"))
//   ) 
// }) 

router.get('/delivery', (req, res) => {
  // Only show partners who are not currently busy
  const sql = `SELECT delivery_id, name, mobile FROM delivery WHERE status = 'AVAILABLE'`;
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data));
  });
});

// 10. Get Vendor Profile details for the logged-in user
router.get('/getVendorProfile', (req, res) => {
    // 1. Security Check
    if (req.user.role !== 'vendor') {
        return res.send(result.createResult("Access Denied"));
    }

    const user_id = req.user.uid;

    // 2. Query the database
    const sql = `
        SELECT vendor_id, business_name, business_description, image 
        FROM vendors_details 
        WHERE user_id = ?
    `;

    pool.query(sql, [user_id], (err, data) => {
        if (err) {
            return res.send(result.createResult(err));
        }
        
        if (data.length === 0) {
            return res.send(result.createResult("Profile not found", null));
        }

        // Return the first record found
        res.send(result.createResult(null, data[0]));
    });
});

router.put('/order/:id/delivered', (req, res) => {
  const orderId = req.params.id;

  // 1. Update order status
  // 2. Free up the delivery partner (setting status back to AVAILABLE)
  const sql = `
    UPDATE customer_tiffin_orders o
    JOIN delivery d ON o.delivery_id = d.delivery_id
    SET o.status = 'DELIVERED', d.status = 'AVAILABLE'
    WHERE o.order_id = ?`;

  pool.query(sql, [orderId], (err) => {
    if (err) return res.send(result.createResult(err));
    res.send(result.createResult(null, "Success"));
  });
});

module.exports = router
