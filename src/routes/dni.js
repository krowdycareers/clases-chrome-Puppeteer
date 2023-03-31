const path = require("path");
const { Router } = require("express");
const DNIService = require("../services/dni");
const fileUpload = require("express-fileupload");
const status = require("http-status");

function dni(app) {
    const router = Router();
    const dniServ = new DNIService();

    app.use("/api/dni", router);

    router.post("/", fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "..", "tmp")
	}), async (req, res) => {
        const result = await dniServ.scrap(req.files?.dni);

        return res.status(result.success ? status.OK : status.BAD_REQUEST).json(result);
    });
}

module.exports = dni;
