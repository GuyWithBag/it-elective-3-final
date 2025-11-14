CREATE DATABASE IF NOT EXISTS it_elective_final_db;
USE it_elective_final_db;

DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role ENUM('admin', 'basic') NOT NULL DEFAULT 'basic',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock_qty INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, role) VALUES
  ('admin', 'admin123', 'admin'),
  ('basic', 'basic123', 'basic');

INSERT INTO inventory_items (item_name, category, stock_qty, unit_price) VALUES
  ('Lenovo ThinkPad X1', 'Laptop', 12, 1450.00),
  ('Dell 24\" Monitor', 'Peripherals', 30, 220.00),
  ('Logitech MX Master 3S', 'Accessories', 50, 99.00);



