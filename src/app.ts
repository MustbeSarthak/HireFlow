import express from 'express';
import cors from "cors";
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/users.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Parse Cookies

app.use('/api/auth', authRoutes );

app.use(errorHandler);
export default app;