const express = require("express");
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Allow domains..
const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || ["*"];


// Database Connection Method Import
const ConnectDatabase = require("./config/databaseConnection");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Loads all routes
require("./routes")(app);

// Error Handler Middleware
app.use(errorHandler);


const startServer = () => {
    ConnectDatabase(); // Database Connection

    app.listen(
        PORT,
        () => console.log(`Server is running on ${PORT} in ${NODE_ENV} environment`)
    );
}

startServer();
