import dotenv from 'dotenv';
import app from './app.js';
import cors from 'cors';

dotenv.config();

app.listen(process.env.PORT, ()=>{
    console.log("Server is running on PORT ", `${process.env.PORT}`)
})
