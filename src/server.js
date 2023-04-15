const app = require("./app");
const { env, port } = require("./config");

const server = app.listen(port, () => {
	console.log("App is running at http://localhost:%d in %s mode", port, env);
	console.log("  Press CTRL-C to stop\n");
});

module.exports = server;
