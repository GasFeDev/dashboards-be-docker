import express, { Router, Request, Response } from "express";
import { getErrorMessage } from "../utils/utils";
import { STATUS_200, STATUS_500 } from "../constants/status";

const healthCheck: Router = express.Router();


// get /health/status
healthCheck.get('/status', async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(STATUS_200).send({
            status: "Up and Running",
            message: "Hell Yeah!"
        });
    } catch (e: any) {
        const errorMessage = getErrorMessage(e.toString());
        return res.status(STATUS_500).send({
            status: "Up and Running",
            message: errorMessage
        });
    }
});


export { healthCheck };