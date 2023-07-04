import { RewardPeriod } from "../schemas/rewardPeriod";
import { RewardsDoc, Rewards } from "../schemas/rewards";
import { findEnum } from "./helpers";

// CRUD operations

export interface FiltersSearch {

    searchText: string;
    token?: any[];
    startDate?: string;
    endDate?: string;

}

export interface RewardsResponse {
    records: RewardsDoc[] | null;
    total: number
};

export const getRewardBySearchId = async (id: number): Promise<RewardsDoc | null> => {
    const reward = await Rewards.findOne({ id });
    return reward;
};


export const getRewardsByAddresses = async (addresses: string[], skip: number, limit: number): Promise<RewardsResponse | null> => {

    try {
        const rewards = await Rewards.aggregate(
            [
                { $match: { address: { $in: addresses } } },
                { $sort: { processDate: -1 } },
                {
                    $project: {
                        _id: 1,
                        amountInDega: 1,
                        token: 1,
                        address: 1,
                        processDate: 1,
                        delivered: 1,
                        amountInNative: 1,
                    }
                },
                {
                    $group:
                    {
                        _id: "$address",
                        address: { $first: "$address" },
                        token: { $first: "$token" },
                        processDate: { $first: "$processDate" },
                        delivered: { $first: "$delivered" },
                        amountInDega: { $first: "$amountInDega" },
                        amountInNative: { $first: "$amountInNative" },
                        totalDegaReward: { $sum: '$amountInDega' },
                        count: { $sum: 1 }
                    },
                }
            ]
        ).skip(skip).limit(limit).exec();


        return {
            records: rewards,
            total: rewards ? rewards.length : 0
        }

    } catch (error) {
        console.log(error);
        return {
            records: null,
            total: 0
        }
    }
}

export const getRewardsByPool = async (network: string, skip: number, limit: number): Promise<RewardsResponse | null> => {

    try {

        const filters = applyPoolsFilters(network);
        //  const networkDivideFactor = findEnum(network);

        const rewards = await RewardPeriod.aggregate(
            [
                { $match: { ...filters } },
                { $sort: { createdAt: -1 } },
                {
                    $group:
                    {
                        _id: "$validator",
                        network: { $first: "$network" },
                        validator: { $first: "$validator" },
                        period: { $first: "$period" },
                        staked: { $first: "$staked" },
                        reward: { $first: "$reward" },
                        participants: { $first: "$participants" },
                        totalReward: { $sum: '$rewardInDega' },
                        count: { $sum: 1 }
                    },
                },
                {
                    $project: {
                        id: 1,
                        network: 1,
                        validator: 1,
                        period: 1,
                        staked: 1,
                        reward: 1,
                        rewardInDega: 1,
                        participants: 1,
                        totalReward: 1,
                    }
                }
            ]
        ).skip(skip).limit(limit).exec();


        return {
            records: rewards,
            total: rewards ? rewards.length : 0
        }

    } catch (error) {
        console.log(error);
        return {
            records: null,
            total: 0
        }
    }
}


export const getRewardsBySearchText = async (filters: FiltersSearch, skip: number, limit: number): Promise<RewardsResponse | null> => {

    const filterObject = applyFilters(filters);

    try {
        if (filterObject && filterObject.length > 0) {

            const rewardsCount = await Rewards.find({
                $and: [...filterObject]
            }).count().exec();

            const rewards = await Rewards.find({
                $and: [...filterObject]
            }).skip(skip).limit(limit).exec();

            return {
                records: rewards,
                total: rewardsCount
            }

        } else {

            const rewards = await Rewards.find({}).exec();

            return {
                records: rewards,
                total: rewards.length
            }
        }
    } catch (error) {
        console.log(error);
        return {
            records: [],
            total: 0
        }
    }

};

const applyFilters = (filters: FiltersSearch) => {

    const { searchText, token, startDate, endDate } = filters;
    const arrayFilter = [];

    if (searchText && searchText != null && searchText != "") {
        arrayFilter.push({
            address: { $eq: searchText }
        });
    }

    if (token && token.length > 0) {
        arrayFilter.push({
            token: { $in: token }
        });
    }

    if (startDate && startDate != null && startDate != "") {
        arrayFilter.push({ processDate: { $gte: startDate } });
    }

    if (endDate && endDate != null && endDate != "") {
        arrayFilter.push({ processDate: { $lte: endDate } });
    }

    return arrayFilter;

}

const applyPoolsFilters = (network: string) => {

    let objectFilter = {};

    if (network) {
        objectFilter = { network: { $eq: network } };
    }

    return objectFilter;
}


