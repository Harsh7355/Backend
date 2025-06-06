import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"; // ✅ "cors" should be lowercase, not "Cors"

const app = express();

// ✅ Corrected: methods should be passed as array, and "credentials" key should be lowercase
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Corrected from `method: {}` to `methods: []`
  credentials: true                         // ✅ Correct key: credentials (not Credential)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Best practice: explicitly set extended
app.use(express.static("public"));               // ✅ Folder names should be lowercase (optional)
app.use(cookieParser());

export { app };
