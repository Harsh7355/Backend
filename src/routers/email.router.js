
import express from "express";
import sendwelcomemails from "../controllers/sendwelcomeemail.controller.js"; // ✅ Correct path

const router = express.Router();

router.post("/send-welcome-email", sendwelcomemails);

export default router;
