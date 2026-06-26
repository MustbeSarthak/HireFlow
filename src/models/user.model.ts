import type { RegisterBody } from "../interfaces/auth.interface.js";
import pool from '../config/db.js';

// GET ALL USER 
export const getAllUser = async () => {
    const result = await pool.query(`
        SELECT id,name,email,city,role FROM users`);
    return result.rows;
};

//Create USER 

export const createNewUser = async ({
    name,
    username,
    email,
    password,
    role,
    city,
}: RegisterBody) => {
    const result = await pool.query(
        `
        INSERT INTO users
        (name, username, email, password, role, city)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `,
        [name, username, email, password, role, city]
    );

    return result.rows[0];
};


// Find user by email
export const findUserByEmail = async(email:string)=>{
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`, [email]
    );
    return result.rows[0];
};