import mongoose from "mongoose";
import { RewardsRatio, RewardsRatioDoc } from "../schemas/rewardsRatio";

// Retrieve a single RewardsRatio document by id
export const getRewardsRatioById = async (
  id: mongoose.Types.ObjectId
): Promise<RewardsRatioDoc | null> => {
  return RewardsRatio.findById(id).exec();
};

// Retrieve a single RewardsRatio document by address
export const getRewardsRatioByNetwork = async (
  network: string
): Promise<RewardsRatioDoc | null> => {
  return RewardsRatio.findOne({ network }).exec();
};

// Retrieve all RewardsRatio documents
export const getAllRewardsRatios = async (): Promise<RewardsRatioDoc[]> => {
  return RewardsRatio.find().exec();
};
