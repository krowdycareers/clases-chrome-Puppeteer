const config = {
    development: process.env.NODE_ENV === "development",
    production: process.env.NODE_ENV === "production"
};

module.exports = config;
