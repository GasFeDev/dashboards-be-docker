import express, { Request, Response, Router } from "express";
import { STATUS_200, STATUS_500 } from "../constants/status";
import { getErrorMessage } from "../utils/utils";
import { getRewards, getRewardsSearchByAddresses, getRewardsSearchByPool, setCachePool } from "../logic";
import * as dotenv from "dotenv";

dotenv.config();

const rewards: Router = express.Router();

rewards.post('/table', async (req: Request, res: Response): Promise<Response> => {
  try {

    const getRewards: string | any[] = [];

    if (getRewards.length > 0) {
      return res.status(STATUS_500).send(getRewards);
    }
    return res.status(STATUS_200).send(getRewards);
  } catch (e: any) {
    const errorMessage = getErrorMessage(e.toString());
    return res.status(STATUS_500).send({
      status: "error",
      message: errorMessage
    });
  }
});

rewards.post('/search', async (req: Request, res: Response): Promise<Response> => {
  try {

    const { params } = req.body;
    const { filters, skip, limit } = params;

    const rewards = await getRewards(filters, skip, limit);

    return res.status(STATUS_200).send({
      code: "success",
      result: rewards?.records,
      total: rewards?.total
    });

  } catch (e: any) {
    const errorMessage = getErrorMessage(e.toString());
    return res.status(STATUS_500).send({
      status: "error",
      message: errorMessage
    });
  }
});


rewards.post('/searchByAddresses', async (req: Request, res: Response): Promise<Response> => {
  try {

    const { params } = req.body;
    const { addresses, skip, limit } = params;

    if (addresses.length === 0) {
      return res.status(STATUS_200).send({
        code: "success",
        result: [],
        total: 0
      });
    }

    if (addresses.length > 10) {
      return res.status(STATUS_500).send({
        code: "error",
        message: "Maximum 10 addresses allowed",
        result: [],
        total: 0
      });
    }


    const rewards = await getRewardsSearchByAddresses(addresses, skip, limit);

    return res.status(STATUS_200).send({
      code: "success",
      result: rewards?.records,
      total: rewards?.total
    });

  } catch (e: any) {
    const errorMessage = getErrorMessage(e.toString());
    return res.status(STATUS_500).send({
      status: "error",
      message: errorMessage
    });
  }
});

rewards.post('/searchByPool', async (req: Request, res: Response): Promise<Response> => {
  try {

    const { params } = req.body;
    const { skip, limit, network } = params;


    const rewards = await getRewardsSearchByPool(network, skip, limit);

    return res.status(STATUS_200).send({
      code: "success",
      result: rewards?.records,
      total: rewards?.total
    });

  } catch (e: any) {
    const errorMessage = getErrorMessage(e.toString());
    return res.status(STATUS_500).send({
      status: "error",
      message: errorMessage
    });
  }
});

rewards.get('/cachePool', async (req: Request, res: Response): Promise<Response> => {

  const TOKEN = process.env.TOKEN;
  try {

    const { token } = req.headers;

    if (!TOKEN || TOKEN === "") {
      return res.status(403).send({
        code: "403",
        message: "Unauthorized"
      });
    }

    if (token !== TOKEN) {
      return res.status(403).send({
        code: "403",
        message: "Unauthorized"
      });
    }

    const cachedPools = await setCachePool();

    return res.status(STATUS_200).send({
      code: "success",
      result: cachedPools
    });

  } catch (e: any) {
    const errorMessage = getErrorMessage(e.toString());
    return res.status(STATUS_500).send({
      status: "error",
      message: errorMessage
    });
  }
});




export { rewards }
