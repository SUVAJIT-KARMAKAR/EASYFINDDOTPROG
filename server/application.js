import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Applicatioin initialization
const application = express();

// Application configurations
application.use(
    cors({
        origin : [`${process.env.FRONTEND_URL}, "http://localhost:5173`],
        credentials: true
    })
);
application.use(express.json({
    limit: "16kb"
}));
application.use("/static", express.static("public"));
application.use(cookieParser());

// Application routes 
import { authenticationRouter } from "./routes/authentication.routes.js";
import { tokenRouter } from "./routes/newAccessToken.routes.js";

application.use("/api/auth", authenticationRouter);
application.use("/api/token", tokenRouter);

export { application };