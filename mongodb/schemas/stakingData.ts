import mongoose, { Document, Schema } from "mongoose";

export interface StakingDataDoc extends Document {
  id: mongoose.Types.ObjectId;
  date: Date;
  stakingData: String;
  network: String;
  validator: String;
  validatorBonded: String;
}

const stakingDataSchema: Schema = new mongoose.Schema(
  {
    id: { type: mongoose.Types.ObjectId, required: true },
    date: { type: Date, required: false },
    stakingData: { type: String, required: true },
    network: { type: String, required: true },
    validator: { type: String, required: true },
    validatorBonded: { type: String, required: true },
  },
  { timestamps: true }
);

export const StakingData = mongoose.model<StakingDataDoc>(
  "StakingData",
  stakingDataSchema
);
