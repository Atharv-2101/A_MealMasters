const express= require('express')
const pool= require('../utils/db')
const result=require('../utils/result')
const bcrypt = require('bcrypt')
const config=require('../configuration/config')

const router=express.Router()

// PUBLIC DASHBOARD (NO TOKEN)
router.get('/dashboard-public', (req, res) => {

  const queries = {
    tiffins: `SELECT COUNT(*) total FROM tiffin`,
    newOrders: `SELECT COUNT(*) total FROM customer_tiffin_orders WHERE status='PENDING'`,
    confirmed: `SELECT COUNT(*) total FROM customer_tiffin_orders WHERE status='APPROVED'`,
    cancelled: `SELECT COUNT(*) total FROM customer_tiffin_orders WHERE status='CANCELLED'`,
    orders: `SELECT COUNT(*) total FROM customer_tiffin_orders`,
    users: `SELECT COUNT(*) total FROM users WHERE role='customer'`
  }

  pool.query(queries.tiffins, (e1, r1) => {
    if (e1) return res.send(result.createResult(e1))

    pool.query(queries.newOrders, (e2, r2) => {
      if (e2) return res.send(result.createResult(e2))

      pool.query(queries.confirmed, (e3, r3) => {
        if (e3) return res.send(result.createResult(e3))

        pool.query(queries.cancelled, (e4, r4) => {
          if (e4) return res.send(result.createResult(e4))

          pool.query(queries.orders, (e5, r5) => {
            if (e5) return res.send(result.createResult(e5))

            pool.query(queries.users, (e6, r6) => {
              if (e6) return res.send(result.createResult(e6))

              res.send(result.createResult(null, {
                totalTiffin: r1[0].total,
                newOrders: r2[0].total,
                confirmedOrders: r3[0].total,
                cancelledOrders: r4[0].total,
                allOrders: r5[0].total,
                totalUsers: r6[0].total,
                totalInvoices: 0
              }))
            })
          })
        })
      })
    })
  })
})


// Admin Dashboard Stats
router.get('/dashboard', (req, res) => {

  const queries = {
    tiffins: `SELECT COUNT(*) total FROM tiffin`,
    newOrders: `SELECT COUNT(*) total FROM customer_tiffin_orders WHERE status='PENDING'`,
    confirmed: `SELECT COUNT(*) total FROM customer_tiffin_orders WHERE status='APPROVED'`,
    cancelled: `SELECT COUNT(*) total FROM customer_tiffin_orders WHERE status='CANCELLED'`,
    orders: `SELECT COUNT(*) total FROM customer_tiffin_orders`,
    users: `SELECT COUNT(*) total FROM users WHERE role='customer'`
  }

  pool.query(queries.tiffins, (e1, r1) => {
    if (e1) return res.send(result.createResult(e1))

    pool.query(queries.newOrders, (e2, r2) => {
      if (e2) return res.send(result.createResult(e2))

      pool.query(queries.confirmed, (e3, r3) => {
        if (e3) return res.send(result.createResult(e3))

        pool.query(queries.cancelled, (e4, r4) => {
          if (e4) return res.send(result.createResult(e4))

          pool.query(queries.orders, (e5, r5) => {
            if (e5) return res.send(result.createResult(e5))

            pool.query(queries.users, (e6, r6) => {
              if (e6) return res.send(result.createResult(e6))

              res.send(result.createResult(null, {
                totalTiffin: r1[0].total,
                newOrders: r2[0].total,
                confirmedOrders: r3[0].total,
                cancelledOrders: r4[0].total,
                allOrders: r5[0].total,
                totalUsers: r6[0].total,
                totalInvoices: 0
              }))
            })
          })
        })
      })
    })
  })
})


//  1. Display Customer List
router.get('/customerList',(req,res)=>{

    const sql=`SELECT * FROM USERS WHERE role='customer'`
    pool.query(sql,(err,data)=>{
        res.send(result.createResult(err,data))
    })
})

// 2. Display Vendor List
router.get('/vendorLists',(req,res)=>{

    const sql=`SELECT * FROM USERS WHERE role='vendor'`
    pool.query(sql,(err,data)=>{
        res.send(result.createResult(err,data))
    })
})

// ================= CUSTOMER LIST =================
router.get('/customerList', (req, res) => {

  const sql = `
    SELECT 
      id,
      name,
      email,
      phone,
      created_at,
      status,
      address
    FROM users
    WHERE role = 'customer'
    ORDER BY created_at DESC
  `;

  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data));
  });
});

router.get('/vendorList', (req, res) => {

  const sql = `
    SELECT 
      id,
      name,
      email,
      phone,
      created_at,
      status,
      address
    FROM users
    WHERE role = 'vendor'
    ORDER BY created_at DESC
  `;

  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data));
  });
});

// ================= USER DETAILS =================
router.get('/user/:id', (req, res) => {
  const userId = req.params.id

  const sql = `
    SELECT 
      id,
      name,
      email,
      phone,
      address,
      created_at,
      status,
      role
    FROM users
    WHERE id = ?
  `

  pool.query(sql, [userId], (err, data) => {
    if (err) return res.send(result.createResult(err))
    if (data.length === 0)
      return res.send(result.createResult("User not found"))

    res.send(result.createResult(null, data[0]))
  })
})

// ================= PENDING VENDORS =================
router.get('/pendingVendors', (req, res) => {

  const sql = `
    SELECT 
      id,
      name,
      email,
      phone,
      status,
      created_at
    FROM users
    WHERE role = 'vendor' AND status = 'pending'
    ORDER BY created_at DESC
  `;

  pool.query(sql, (err, data) => {
    if (err) return res.send(result.createResult(err));
    res.send(result.createResult(null, data));
  });
});


// 3. Approve Vendor
router.put('/approveVendor/:id', (req, res) => {
    // Check if logged-in user is admin

    const vendor_id = req.params.id;

    const sql = `UPDATE users SET status = 'active' WHERE id = ? AND role = 'vendor'`;

    pool.query(sql, [vendor_id], (err, data) => {
        if (err) return res.send(result.createResult(err));
        if (data.affectedRows === 0) {
            return res.send(result.createResult("No vendor found or already approved"));
        }
        res.send(result.createResult(null, 'Vendor approved'));
    });
});


// 4.display all orders data
router.get('/allOrders', (req, res) => {
    const sql = `
        SELECT 
            o.order_id,
            o.start_date,
            o.end_date,
            o.status,
            c.name AS customer_name,
            c.email AS customer_email,
            c.phone AS customer_phone,
            v.business_name AS vendor_name,
            t.title AS tiffin_name,
            s.plan_type,
            s.price
        FROM customer_tiffin_orders o
        JOIN users c ON o.customer_id = c.id
        JOIN vendors_details v ON o.vendor_id = v.vendor_id
        JOIN tiffin t ON o.tiffin_id = t.tiffin_id
        JOIN subscription_plans s ON o.plan_id = s.plan_id
        ORDER BY o.created_at DESC
    `;

    pool.query(sql, (err, data) => {
        if (err) return res.send(result.createResult(err));
        if (data.length === 0) return res.send(result.createResult(null, "No orders placed yet"));
        res.send(result.createResult(null, data));
    });
});

// 5. order by status
router.get('/ordersByStatus/:status', (req, res) => {

    // Only admin allowed
    if (req.user.role !== 'admin') {
        return res.send(result.createResult("Access Denied"));
    }

    const { status } = req.params;

    const sql = `
        SELECT 
            o.order_id,
            o.start_date,
            o.end_date,
            o.status,
            c.name AS customer_name,
            c.email AS customer_email,
            c.phone AS customer_phone,
            v.business_name AS vendor_name,
            t.title AS tiffin_name,
            s.plan_type,
            s.price
        FROM customer_tiffin_orders o
        JOIN users c ON o.customer_id = c.id
        JOIN vendors_details v ON o.vendor_id = v.vendor_id
        JOIN tiffin t ON o.tiffin_id = t.tiffin_id
        JOIN subscription_plans s ON o.plan_id = s.plan_id
        WHERE o.status = ?
        ORDER BY o.created_at DESC
    `;

    pool.query(sql, [status], (err, data) => {
        if (err) return res.send(result.createResult(err));
        if (data.length === 0) return res.send(result.createResult(null, `No orders with status ${status}`));
        res.send(result.createResult(null, data));
    });
});

// 6. TO ADD NEW DELIVERY PERSON
router.post('/addDelivery', (req, res) => {
  if (req.user.role !== 'admin')
    return res.send(result.createResult("Access Denied")) 

  const { name, mobile } = req.body 

  pool.query(
    `INSERT INTO delivery(name, mobile) VALUES (?, ?)`,
    [name, mobile],
    (err) => res.send(result.createResult(err, "Delivery Person Added"))
  ) 
}) 

// 7. TO GET ALL DELIVERY PERSONS
router.get('/delivery', (req, res) => {
  if (req.user.role !== 'admin')
    return res.send(result.createResult("Access Denied")) 

  pool.query(`SELECT * FROM delivery`, (err, data) => {
    res.send(result.createResult(err, data)) 
  }) 
}) 

// 8. add new vendor
router.post('/addVendor', (req, res) => {
    if(req.user.role !== 'admin') 
        return res.send(result.createResult("Access Denied"));

    const { name, email, password_hash, phone } = req.body;

    bcrypt.hash(password_hash, config.SALT_ROUND, (err, hashedPassword) => {
        if(err) return res.send(result.createResult(err));

        const sql = `INSERT INTO users (name,email,password_hash,phone,role,status) VALUES (?,?,?,?, 'vendor', 'active')`;

        pool.query(sql, [name,email,hashedPassword,phone], (err2, data) => {
            res.send(result.createResult(err2, "Vendor added successfully"));
        });
    });
});

// 9. add New Customer
router.post('/addCustomer', (req, res) => {
    if(req.user.role !== 'admin') 
        return res.send(result.createResult("Access Denied"));

    const { name, email, password_hash, phone } = req.body;

    bcrypt.hash(password_hash, config.SALT_ROUND, (err, hashedPassword) => {
        if(err) return res.send(result.createResult(err));

        const sql = `INSERT INTO users (name,email,password_hash,phone,role,status) VALUES (?,?,?,?, 'customer', 'active')`;

        pool.query(sql, [name,email,hashedPassword,phone], (err2, data) => {
            res.send(result.createResult(err2, "Customer added successfully"));
        });
    });
});
// Update Order Status (APPROVE / CANCEL)
router.put('/updateOrderStatus/:id', (req, res) => {

  const orderId = req.params.id;
  const { status } = req.body;

  const sql = `UPDATE customer_tiffin_orders SET status=? WHERE order_id=?`;

  pool.query(sql, [status, orderId], (err, data) => {
    if (err) return res.send(result.createResult(err));

    res.send(result.createResult(null, "Order status updated"));
  });
});
// ================= TIFFIN MANAGEMENT =================

// Get all tiffins
router.get('/tiffins', (req, res) => {
  const sql = `
    SELECT t.*, v.business_name
    FROM tiffin t
    LEFT JOIN vendors_details v ON t.vendor_id = v.vendor_id
  `;

  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data));
  });
});

// Add new tiffin
router.post('/tiffins', (req, res) => {

  // only vendor or admin allowed
  if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
    return res.send(result.createResult("Access Denied"))
  }

  const { title, type, description, cost, image } = req.body
  const userId = req.user.uid   // 🔥 from token

  // find vendor_id for logged-in user
  pool.query(
    `SELECT vendor_id FROM vendors_details WHERE user_id = ?`,
    [userId],
    (e, v) => {
      if (e || v.length === 0) {
        return res.send(result.createResult("Vendor not found"))
      }

      const vendor_id = v[0].vendor_id

      const sql = `
        INSERT INTO tiffin (vendor_id, title, type, description, cost, image)
        VALUES (?, ?, ?, ?, ?, ?)
      `

      pool.query(
        sql,
        [vendor_id, title, type, description, cost, image],
        (err) => res.send(result.createResult(err, "Tiffin Added"))
      )
    }
  )
})



// Delete tiffin
router.delete('/tiffins/:id', (req, res) => {
  pool.query(
    `DELETE FROM tiffin WHERE tiffin_id=?`,
    [req.params.id],
    (err) => res.send(result.createResult(err, "Tiffin Deleted"))
  );
});

router.delete("/deleteVendor/:id", (req, res) => {
  pool.query(
    "DELETE FROM users WHERE id=? AND role='vendor'",
    [req.params.id],
    (err) => res.send(result.createResult(err, "Vendor deleted"))
  );
});



module.exports=router