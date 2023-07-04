import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const URL_API = process.env.URL_API || "https://cardano-mainnet.blockfrost.io/api/v0/pools/";
const CARDANO_PROJECT_ID = process.env.CARDANO_PROJECT_ID || "";
const CARDANO_POOLS_IDS = process.env.CARDANO_POOLS_IDS || "";

export const getPoolUsersCache = async () => {

    const poolsIds = CARDANO_POOLS_IDS.split(",") || [];

    const cachePools: any[] = [];

    if (poolsIds.length === 0) {
        return cachePools;
    }

    const headers = {
        "Content-Type": "application/json",
        project_id: CARDANO_PROJECT_ID,
    }


    try {

        for (let i = 0; i < poolsIds.length; i++) {
            let pagination = 1;

            let poolCache: any[] = [];
            while (true) {
                let control = [];
                const result = await axios.get(`${URL_API}${poolsIds[i]}/delegators`, {
                    headers: headers,
                    params: {
                        page: pagination,
                        count: 100
                    }
                }).then((response) => {
                    control = response?.data;
                    if (control && control.length > 0) {
                        poolCache = poolCache.concat(control);
                    }
                }).catch((error) => {
                    console.log("error", error);
                }).finally(() => {
                    console.log("end looping");
                });

                pagination++;
                console.log("pagination", pagination);

                if (pagination > 100 || control.length === 0) {
                    break;
                }

            }

            cachePools.push({
                poolId: poolsIds[i],
                records: poolCache,
            });

            pagination = 1;
        }

        return cachePools;

    } catch (error) {
        console.log("getLiveStaked Users Cache", error);
    }


}

export const getPoolCache = async () => {
    const poolsIds = CARDANO_POOLS_IDS.split(",") || [];

    const cachePools: any[] = [];

    if (poolsIds.length === 0) {
        return cachePools;
    }

    const headers = {
        "Content-Type": "application/json",
        project_id: CARDANO_PROJECT_ID,
    }


    try {

        for (let i = 0; i < poolsIds.length; i++) {

            const result = await axios.get(`${URL_API}${poolsIds[i]}`, {
                headers: headers
            }).then((response) => {
                const data = response.data;
                if (data) {

                    cachePools.push({
                        poolId: poolsIds[i],
                        liveStaked: data.live_stake,
                    });
                }
            }).catch((error) => {
                console.log("error getting pools cache", error);
            }).finally(() => {
                console.log("end looping pools cache");
            });

        }

        console.log("cachePools", cachePools);
        return cachePools;

    } catch (error) {
        console.log("getLiveStaked Pools", error);
    }
}