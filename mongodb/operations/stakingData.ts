import mongoose from "mongoose";
import { StakingData, StakingDataDoc } from "../schemas/stakingData";
import { RewardNetworks } from "../../constants/RewardNetworks";

export const createStakingData = async (
    data: StakingDataDoc
): Promise<StakingDataDoc> => {
    return StakingData.create(data);
};

export const getStakingDataById = async (
    id: mongoose.Types.ObjectId
): Promise<StakingDataDoc | null> => {
    return StakingData.findById(id).exec();
};
export const getStakingDataByDate = async (
    date: string,
    validator: String,
    network: RewardNetworks
): Promise<StakingDataDoc | null> => {
    return StakingData.findOne({
        date: { $gte: new Date(date) },
        validator,
        network,
    }).exec();
};

export const updateStakingDataById = async (
    id: mongoose.Types.ObjectId,
    data: Partial<StakingDataDoc>
): Promise<StakingDataDoc | null> => {
    return StakingData.findByIdAndUpdate(id, data, { new: true }).exec();
};

export const deleteStakingDataById = async (
    id: mongoose.Types.ObjectId
): Promise<StakingDataDoc | null> => {
    return StakingData.findByIdAndDelete(id).exec();
};

export const getAllStakingData = async (): Promise<StakingDataDoc[]> => {
    return StakingData.find().exec();
};
