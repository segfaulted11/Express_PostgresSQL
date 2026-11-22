import { Pool } from "pg";
import config from "../config";

//connecting the server w the database
export const pool = new Pool({
  connectionString:config.connection_string,
});

//initialzing the database :
export const initDatabase = async () => {
  try {
    // creating a table named 'users' in the database
    await pool.query(`
CREATE TABLE IF NOT EXISTS users(
id SERIAL PRIMARY KEY,
name VARCHAR(255),
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
age INT,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);
            `);
    console.log("database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};