import mongoose, { Document, Schema } from "mongoose";
import { RewardNetworks } from "../../constants/RewardNetworks";

export interface RewardPeriodDoc extends Document {
    id: mongoose.Types.ObjectId;
    network: RewardNetworks;
    period: number;
    staked: string;
    reward: string;
    participants: number;
    validator: string;
    rewardInDega: mongoose.Types.Decimal128;
}

const rewardPeriodSchema: Schema = new mongoose.Schema(
    {
        id: { type: mongoose.Types.ObjectId, unique: true, required: true },
        network: { type: String, required: true },
        period: { type: Number, required: true },
        staked: { type: String, required: true },
        reward: { type: String, required: true },
        participants: { type: Number, required: true },
        validator: { type: String, required: true },
        rewardInDega: { type: mongoose.Types.Decimal128, required: false },
    },
    { timestamps: true }
);

export const RewardPeriod = mongoose.model<RewardPeriodDoc>("RewardPeriod", rewardPeriodSchema);