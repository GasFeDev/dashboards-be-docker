import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { connectDb } from "./mongodb";
import express, { Application, NextFunction, Request, Response } from "express";
import { healthCheck, rewards } from "./services";
import cors from "cors";
import { getErrorMessage } from "./utils/utils";
import { graphs } from "./services/graphs";
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 4000;
/* const origins = process.env.CORS_ORIGIN || ""; */
/* const corsOptions = process.env.ENV === 'DEV' ? ["http://localhost:3000","http://localhost:3001"]: origins.split(','); */

//En produccion
const origins = "https://uat-dega.org%2Chttps//www.uat-dega.org,https://rewards.uat-dega.org,https://www.rewards.uat-dega.org"
const corsOptions = origins.split(','); 

const allowlist = [...corsOptions];

const corsOptionsDelegate = (req: Request, callback: any) => {

    let corsOptions;
    let origin = req.header('Origin') || "";
    let isDomainAllowed = allowlist.indexOf(origin) !== -1;

    if (isDomainAllowed) {
        // Enable CORS for this request
        corsOptions = { origin: true }
    } else {
        // Disable CORS for this request
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptionsDelegate));
app.options('*', cors(corsOptionsDelegate)); 

app.use("/health", healthCheck);
app.use("/rewards", rewards);
app.use("/graphs", graphs);

// UnKnown Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

try {
    app.listen(port, (): void => {
        connectDb();
        console.log(`Connected succesfully on port: ${port}`);
    });
} catch (err) {

    console.error(getErrorMessage(err));
}