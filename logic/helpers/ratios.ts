import { RewardsRatioDoc } from "../../mongodb/schemas/rewardsRatio";

export const getRatioByNetwork = (ratios: RewardsRatioDoc[], network: string): number => {
    try {
        const rewardRation = ratios.find(r => r.network.toLocaleLowerCase() === network);

        return rewardRation ? Number(rewardRation.OneCoinToDegaRelation) : 1;
    } catch (error) {
        console.log(error);
        return 1;
    }
}