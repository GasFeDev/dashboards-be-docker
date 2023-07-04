import {
    GraphsResponse,
} from "../mongodb/operations/rewardPeriod";
import { getPoolsGraphsByNetwork } from "../mongodb/operations/rewardPeriod";
import { getAllRewardsRatios } from "../mongodb/operations/rewardsRatio";
import { getRatioByNetwork } from "./helpers";


export const getPoolsGraphs = async (network: string): Promise<GraphsResponse[] | null> => {

    try {

       // const rewardRations = await getAllRewardsRatios();
        const networkRatio = 1;// getRatioByNetwork(rewardRations, network.toLocaleLowerCase());

        const poolGraphs = await getPoolsGraphsByNetwork(network, networkRatio);

        return poolGraphs;

    } catch (e) {
        console.log(e);
        return [];
    }
}