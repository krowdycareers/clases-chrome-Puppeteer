const compression = require("compression");
const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const status = require("http-status");
const morgan = require("morgan");

const { development } = require("./config");
const dni = require("./routes/dni");

const app = express();

app.enable("trust proxy");

// Development logging
if(development) {
    app.use(morgan("dev"));
}


// Implementing CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet({
    crossOriginEmbedderPolicy: false
}));

// Limit requests from same API
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
    legacyHeaders: false
});
app.use(limiter);

app.use(compression());


app.get("/", (req, res) => {
    return res.status(status.OK).json({
        name: "dni-scraper",
        version: "1.0.0",
        author: "Gustavo Eduardo Ordoño Poma"
    });
});

// Routes
dni(app);

app.all("*", (req, res) => {
    return res.status(status.NOT_FOUND).json({
        success: false,
        message: `Can't find [${req.method}] ${req.originalUrl} resolver on this server!`
    });
});


module.exports = app;
