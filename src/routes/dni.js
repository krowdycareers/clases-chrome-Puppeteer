const { Router } = require("express");
const DNIService = require("../services/dni");
const status = require("http-status");

function dni(app) {
    const router = Router();
    const dniServ = new DNIService();

    app.use("/api/dni", router);

    router.get("/", async (req, res) => {
        const result = await dniServ.getExample();

        return res.status(status.OK).json(result);
    });
}

module.exports = dni;
