import dotenv from 'dotenv';
import app from './app.js';
import pool from './config/db.js'

dotenv.config();

// Server Running
app.listen(process.env.PORT, ()=>{
    console.log("Server is running on PORT ", `${process.env.PORT}`)
})
