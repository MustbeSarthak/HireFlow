import pkg from "pg";
import dotenv from "dotenv";
dotenv.config()
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER!,
    host: process.env.DB_HOST!,
    database: process.env.DB_DATABASE!,
    password: process.env.DB_PASSWORD!,
    port: Number(process.env.DB_PORT),
});

pool
    .connect()
    .then((client) => {
        console.log("Connected With the DB!");
        client.release();
    })
    .catch((err) => {
        console.error("Connection Error:", err);
    });

export default pool;