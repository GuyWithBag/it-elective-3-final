const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "it_elective_final_db",
  port: "3306",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
