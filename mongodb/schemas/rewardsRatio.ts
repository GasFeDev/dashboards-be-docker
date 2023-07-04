import mongoose, { Document, Schema } from "mongoose";

export interface RewardsRatioDoc extends Document {
  id: mongoose.Types.ObjectId;
  network: string;
  OneCoinToDegaRelation: string;
}

const rewardsRationSchema: Schema = new mongoose.Schema(
  {
    id: { type: mongoose.Types.ObjectId, required: true, unique: true },
    network: { type: String, required: true, unique: true },
    OneCoinToDegaRelation: { type: String, required: true },
  },
  { timestamps: true }
);

export const RewardsRatio = mongoose.model<RewardsRatioDoc>(
  "RewardsRatio",
  rewardsRationSchema
);
