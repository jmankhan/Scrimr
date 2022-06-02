import express from "express";
const router = express.Router();
import AuthService from "../services/auth.service.js";
import requireAuth from "../middlewares/auth.js";

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

router.post("/register", async function (req, res, next) {
    try {
        const user = await AuthService.register(req.body);
        res.status(200).json({
            message: "Success",
            user,
        });
    } catch (e) {
        next(e);
    }
});

router.post("/login", async function (req, res, next) {
    try {
        const user = await AuthService.login(req.body);
        res.status(200).json({
            message: "Success",
            user,
        });
    } catch (e) {
        res.status(e.statusCode).json({ message: e.message });
    }
});

router.get("/all", requireAuth, async function (req, res, next) {
    try {
        const data = await AuthService.all();
        res.status(200).json({
            status: true,
            message: "All users",
            data,
        });
    } catch (e) {
        res.status(e.statusCode).json({ message: e.message });
    }
});

export default router;
