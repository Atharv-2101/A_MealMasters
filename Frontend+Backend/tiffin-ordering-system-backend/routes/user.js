const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../utils/db");
const result = require("../utils/result");
const config = require("../configuration/config");

const router = express.Router();

/* ================= CUSTOMER SIGNUP ================= */

router.post("/customer/signup", (req, res) => {
  const { name, email, password_hash, phone, address } = req.body;

  const sql =
    "INSERT INTO users(name,email,password_hash,phone,address,role,status) VALUES (?,?,?,?,?,'customer','active')";

  bcrypt.hash(password_hash, config.SALT_ROUND, (err, hashedPassword) => {
    if (err) return res.send(result.createResult(err));

    pool.query(sql, [name, email, hashedPassword, phone, address], (err2, data) => {
      res.send(result.createResult(err2, data));
    });
  });
});

/* ================= VENDOR SIGNUP ================= */

router.post("/vendor/signup", (req, res) => {
  const { name, email, password_hash, phone, address } = req.body;

  const sql = `
    INSERT INTO users (name,email,password_hash,phone,address,role,status)
    VALUES (?,?,?,?,?,'vendor','pending')
  `;

  bcrypt.hash(password_hash, config.SALT_ROUND, (err, hashedPassword) => {
    if (err) return res.send(result.createResult(err));

    pool.query(sql, [name, email, hashedPassword, phone, address], (err2, data) => {
      res.send(result.createResult(err2, data));
    });
  });
});

/* ================= ADMIN SIGNUP (OPTIONAL) ================= */

router.post("/admin/signup", (req, res) => {
  const { name, email, password_hash, phone, address } = req.body;

  const sql =
    "INSERT INTO users(name,email,password_hash,phone,address,role,status) VALUES (?,?,?,?,?,'admin','active')";

  bcrypt.hash(password_hash, config.SALT_ROUND, (err, hashedPassword) => {
    if (err) return res.send(result.createResult(err));

    pool.query(sql, [name, email, hashedPassword, phone, address], (err2, data) => {
      res.send(result.createResult(err2, data));
    });
  });
});

/* ================= SIGN IN ================= */

router.post("/signin", (req, res) => {
  const { email, password_hash } = req.body;

  console.log("DB NAME:", pool.config.connectionConfig.database);
  console.log("Signin email:", email);

  const sql = "SELECT * FROM users WHERE email=?";

  pool.query(sql, [email], (err, data) => {
    if (err) return res.send(result.createResult(err));

    console.log("DB result:", data);

    if (data.length === 0)
      return res.send(result.createResult("Invalid Email"));

    const userRow = data[0];

    // status check
    if (userRow.status !== "active")
      return res.send(result.createResult("Account not active"));

    bcrypt.compare(password_hash, userRow.password_hash, (err2, match) => {
      if (!match) return res.send(result.createResult("Invalid Password"));

      const payload = {
        uid: userRow.id,
        role: userRow.role,
      };

      const token = jwt.sign(payload, config.SECRET);

      const user = {
        token,
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        phone: userRow.phone,
        address: userRow.address,
        role: userRow.role,
      };

      res.send(result.createResult(null, user));
    });
  });
});

module.exports = router;


