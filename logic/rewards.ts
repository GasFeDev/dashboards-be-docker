import { cache } from "../cache";
import {
    getRewardsBySearchText,
    getRewardBySearchId,
    FiltersSearch,
    RewardsResponse,
    getRewardsByAddresses,
    getRewardsByPool
} from "../mongodb/operations/rewards";
import { getPoolCache, getPoolUsersCache } from "../services/helpers";



export const getRewardById = async (id: number) => {

    try {
        const reward = await getRewardBySearchId(id);

        return reward;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const getRewards = async (filters: FiltersSearch, skip: number, limit: number): Promise<RewardsResponse | null> => {

    try {
        const rewards = await getRewardsBySearchText(filters, skip, limit);

        return rewards;
    } catch (e) {
        console.log(e);
        return {
            records: null,
            total: 0
        };
    }
}


export const getRewardsSearchByAddresses = async (addresses: string[], skip: number, limit: number): Promise<RewardsResponse | null> => {

    try {
        const rewards = await getRewardsByAddresses(addresses, skip, limit);
        const records = rewards?.records ? rewards.records : [];
        const mappedRewards = mapLiveUserStaking(records);

        return {
            total: rewards ? rewards.total : 0,
            records: mappedRewards,
        };
    } catch (e) {
        console.log(e);
        return {
            records: null,
            total: 0
        };
    }
}


export const getRewardsSearchByPool = async (network: string, skip: number, limit: number): Promise<RewardsResponse | null> => {

    try {


        //const rewardRations = await getAllRewardsRatios();
        const rewards = await getRewardsByPool(network, skip, limit);
        const records = rewards?.records ? rewards.records : [];

        /* const rewardsRatio = records.map((reward: any) => {
             const ratio = getRatioByNetwork(rewardRations, reward.network.toLowerCase());
             return {
                 ...reward,
                 totalDegaReward: reward.totalReward * Number(ratio)
             }
         });*/

        const mappedRewards = mapLivePoolStaking(records);

        return {
            records: mappedRewards,
            total: rewards ? rewards.total : 0
        };
    } catch (e) {
        console.log(e);
        return {
            records: null,
            total: 0
        };
    }
}


const mapLiveUserStaking = (rewards: any[]) => {

    const newRewards = [...rewards]
    for (let i = 0; i < newRewards.length; i++) {

        const findUserAddress = findUserAcumulated(newRewards[i].address);
        newRewards[i].totalReward = newRewards[i].totalDegaReward.toString();

        if (findUserAddress) {
            const staked = findUserAddress.live_stake ? findUserAddress.live_stake : 0;
            const liveStakedDivied = Number(staked) / 1000000;

            newRewards[i].liveStaked = liveStakedDivied;

        } else {
            newRewards[i].liveStaked = 0;
        }
    }
    return newRewards;
}

const findUserAcumulated = (address: string) => {

    const usersCache: any = getPoolByCacheKey("usersCache");
    if (usersCache?.length > 0) {

        for (let i = 0; i < usersCache.length; i++) {
            const pool = usersCache[i];

            const findUserAddress = pool?.records?.find((user: any) => user.address === address);

            if (findUserAddress) {
                return {
                    address: findUserAddress.address,
                    live_stake: findUserAddress.live_stake
                }
            }

        }

        return null;
    }

    return null;

}


const mapLivePoolStaking = (rewards: any[]) => {

    const poolCache: any = getPoolByCacheKey("poolCache");
    const newRewards = [...rewards]
    for (let i = 0; i < newRewards.length; i++) {

        const findPool = poolCache?.find((pool: any) => pool.poolId === newRewards[i].validator);
        newRewards[i].totalRewardInDega = newRewards[i]?.totalReward.toString();

        if (findPool) {
            console.log("FIND POOL", findPool);
            const staked = findPool.liveStaked ? findPool.liveStaked : newRewards[i].staked;;
            const liveStakedDivied = Number(staked) / 1000000;
            newRewards[i].staked = liveStakedDivied;
        }
    }
    return newRewards;
}

export const setCachePool = async () => {

    try {
        const chachedTime = 60 * 60 * 24;
        /* if (poolUsersCache && poolCache) {
             console.log("cache exists");
             return {
                 usersCache: poolUsersCache,
                 poolCache: poolCache
             };
         } */

        const poolsCache = await getPoolCache();
        cache.set("poolCache", poolsCache, chachedTime);

        const usersCache = await getPoolUsersCache();
        cache.set("usersCache", usersCache, chachedTime);

        return {
            usersCache: usersCache,
            poolCache: poolsCache
        };
    } catch (e) {
        console.log(e);
        return null
    }
}

const getPoolByCacheKey = (cacheKey: string) => {
    return cache.get(cacheKey);
}