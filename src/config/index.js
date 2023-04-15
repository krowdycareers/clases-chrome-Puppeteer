const config = {
	development: process.env.NODE_ENV === "development",
	env: process.env.NODE_ENV,
	port: process.env.PORT || "4000",
	production: process.env.NODE_ENV === "production"
};

module.exports = config;
