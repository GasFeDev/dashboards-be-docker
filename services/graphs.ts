import express, { Request, Response, Router } from "express";
import { STATUS_200, STATUS_500 } from "../constants/status";
import { getErrorMessage } from "../utils/utils";
import { getPoolsGraphs } from "../logic";

const graphs: Router = express.Router();



graphs.post('/pools', async (req: Request, res: Response): Promise<Response> => {
    try {

        const { params } = req.body;
        const { network } = params;

        if (!network) {
            return res.status(STATUS_500).send({
                status: "error",
                message: "network is required"
            });
        }

        const poolGraphs = await getPoolsGraphs(network);

        return res.status(STATUS_200).send({
            code: "success",
            result: poolGraphs
        });

    } catch (e: any) {
        const errorMessage = getErrorMessage(e.toString());
        return res.status(STATUS_500).send({
            status: "error",
            message: errorMessage
        });
    }
});




export { graphs }
