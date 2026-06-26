import express from 'express';
import cors from "cors";
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(errorHandler);
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Parse Cookies

export default app;