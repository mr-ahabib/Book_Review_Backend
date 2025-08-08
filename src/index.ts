import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import { createServer } from 'http';
import compression from 'compression';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import hpp from 'hpp';
import path from 'path';
import fs from 'fs';

import db from './config/sequelize'; // Adjust path if needed
import routes from './routes/index';
import { errorMiddleware } from "./middleware/error";
import morganMiddleware from './logger/morganLogger';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '8080', 10);
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Uploads folder created');
}

// Middleware setup
app.use(morganMiddleware);
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Use secure secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // true if HTTPS
  })
);

// CORS configuration
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));


// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


// Define the routes
app.use("", routes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Error-handling middleware
app.use(errorMiddleware);

// Create HTTP server
const server = createServer(app);

// Connect to database
db.authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Database connection failed:', err));

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
