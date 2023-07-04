import mongoose, { Document, Schema } from "mongoose";
import { Token } from "./nft";

export interface RewardsDoc extends Document {
  id: mongoose.Types.ObjectId;
  token: Token;
  address: String;
  delivered: Boolean;
  processDate: Date;
  block: String;
  amountInDega: mongoose.Types.Decimal128;
  amountInNative: String;
}

const rewardsSchema: Schema = new mongoose.Schema(
  {
    id: { type: mongoose.Types.ObjectId, required: true },

    token: { type: String, required: true },
    address: { type: String, required: true },
    delivered: { type: Boolean, required: false },
    processDate: { type: Date, required: false },
    block: { type: String, required: false },
    amountInDega: { type: mongoose.Types.Decimal128, required: false },
    amountInNative: { type: String, required: false },
  },
  { timestamps: true }
);

export const Rewards = mongoose.model<RewardsDoc>("Rewards", rewardsSchema);
