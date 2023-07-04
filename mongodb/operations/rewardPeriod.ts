import mongoose from "mongoose";
import { RewardPeriod, RewardPeriodDoc } from "../schemas/rewardPeriod";
import { findEnum } from "./helpers";

export interface GraphVertex {
  x: number;
  y: number;
}

export interface GraphsResponse {
  title: string;
  network: string;
  type: string;
  total: number;
  records: GraphVertex[];
}


export async function getRewardPeriods(): Promise<RewardPeriodDoc[]> {
  return await RewardPeriod.find();
}

export async function getRewardPeriodById(id: mongoose.Types.ObjectId): Promise<RewardPeriodDoc | null> {
  return await RewardPeriod.findById(id);
}

export const getPoolsGraphsByNetwork = async (network: string, networkRatio: number): Promise<GraphsResponse[] | []> => {

  const networkDivideFactor = findEnum(network);
  console.log("FACTOR: ", networkDivideFactor);
  const rewards = await RewardPeriod.aggregate(
    [
      { $match: { network: { $eq: network } } },
      {
        $project: {
          id: 1,
          network: 1,
          validator: 1,
          period: 1,
          reward: 1,
          participants: 1,
          createdAt: 1,
          staked: 1,
          rewardInDega: 1,
        },

      },
      {
        $group:
        {
          _id: "$period",
          network: { $first: "$network" },
          validator: { $first: "$validator" },
          period: { $first: "$period" },
          reward: { $first: "$reward" },
          createdAt: { $first: '$createdAt' },
          staked: {
            $sum: {
              $convert: { 'input': '$staked', 'to': 'double' }
            }
          },
          rewardInDega: {
            $sum: {
              $convert: { 'input': '$rewardInDega', 'to': 'double' }
            }
          },
          participants: {
            $sum: {
              $convert: { 'input': '$participants', 'to': 'double' }
            }
          },
          count: { $sum: 1 }
        },
      },
      { $sort: { createdAt: 1 } }
    ]
  );

  const graphs: GraphsResponse[] = buildGraphs(rewards, networkRatio, networkDivideFactor);



  return graphs;

}

const buildGraphs = (rewards: RewardPeriodDoc[], networkRatio: number, networkDivideFactor: number): GraphsResponse[] => {

  const stakedGraph: GraphsResponse = {
    title: "",
    network: "",
    type: "",
    total: 0,
    records: []
  }
  const rewardGraph: GraphsResponse = {
    title: "",
    network: "",
    type: "",
    total: 0,
    records: []
  }
  const participantsGraph: GraphsResponse = {
    title: "",
    network: "",
    type: "",
    total: 0,
    records: []
  }

  rewards.forEach((reward: any,) => {
    //TO improve

    stakedGraph.title = `TOTAL ${reward.network.toUpperCase()} STAKED`;
    stakedGraph.network = reward.network;
    stakedGraph.type = "staked";
    stakedGraph.total += (Number(reward.staked));

    const rewardDivided = Number(reward.staked) / 1000000;

    stakedGraph.records.push({ x: reward.createdAt.toLocaleDateString('en-US'), y: rewardDivided });

    // const newReward = (Number(reward.reward) / networkDivideFactor) * networkRatio;

    rewardGraph.title = `TOTAL DEGA REWARDED`;
    rewardGraph.network = reward.network;
    rewardGraph.type = "reward";

    const rewardInDegaNumber = Number(reward.rewardInDega.toString());
    rewardGraph.total += rewardInDegaNumber;

    rewardGraph.records.push({ x: reward.createdAt.toLocaleDateString('en-US'), y: rewardInDegaNumber });

    participantsGraph.title = `TOTAL ${reward.network.toUpperCase()} PARTICIPANTS`;
    participantsGraph.network = reward.network;
    participantsGraph.type = "participants";
    participantsGraph.total += reward.participants;
    participantsGraph.records.push({ x: reward.createdAt.toLocaleDateString('en-US'), y: reward.participants });

  });


  const stakedDivided = stakedGraph.total / 1000000;
  stakedGraph.total = stakedDivided;

  const graphs: GraphsResponse[] = [stakedGraph, rewardGraph, participantsGraph];

  return graphs;
}