DROP DATABASE IF EXISTS onlinetiffinsystem_db;
CREATE DATABASE onlinetiffinsystem_db;
USE onlinetiffinsystem_db;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer','vendor','admin')),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(256) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(100),
  created_at TIMESTAMP DEFAULT now(),
  status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE address_details (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,

  address TEXT NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  city VARCHAR(100),
  district VARCHAR(100),
  state VARCHAR(100),

  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


CREATE TABLE vendors_details(
    vendor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    image VARCHAR(200),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    business_name VARCHAR(500),         
    business_description VARCHAR(800)   
);

CREATE TABLE tiffin (
    tiffin_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    title VARCHAR(100),
    type ENUM('VEG', 'NONVEG'),
    description VARCHAR(300),
    cost DECIMAL(10,2),
    image VARCHAR(255),
    FOREIGN KEY (vendor_id) REFERENCES vendors_details(vendor_id) ON DELETE CASCADE
);

CREATE TABLE subscription_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    tiffin_id INT NOT NULL,
    vendor_id INT NOT NULL,
    plan_type ENUM('DAILY','WEEKLY','MONTHLY','YEARLY') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_days INT NOT NULL,
    meals_per_day INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (tiffin_id) REFERENCES tiffin(tiffin_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors_details(vendor_id)
);

CREATE TABLE delivery (
  delivery_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  status ENUM('AVAILABLE','BUSY') DEFAULT 'AVAILABLE'
);

CREATE TABLE customer_tiffin_orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,

    customer_id INT NOT NULL,
    vendor_id INT NOT NULL,
    tiffin_id INT NOT NULL,
    plan_id INT NOT NULL,
    delivery_id INT,
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    status ENUM('PENDING','APPROVED','DELIVERED','CANCELLED')
           DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors_details(vendor_id),
    FOREIGN KEY (tiffin_id) REFERENCES tiffin(tiffin_id),
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id),
    FOREIGN KEY (delivery_id) REFERENCES delivery(delivery_id)
);