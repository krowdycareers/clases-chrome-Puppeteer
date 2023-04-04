const path = require("path");
const { Router } = require("express");
const OCRService = require("../services/ocr");
const fileUpload = require("express-fileupload");
const status = require("http-status");

function ocr(app) {
    const router = Router();
    const ocrServ = new OCRService();

    app.use("/api/ocr", router);

    router.post("/dni", fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "..", "tmp")
	}), async (req, res) => {
        const result = await ocrServ.scrapDNI(req.files?.dni);

        return res.status(result.success ? status.OK : status.BAD_REQUEST).json(result);
    });
}

module.exports = ocr;
