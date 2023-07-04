import { NetworksMultiplyFactor } from "../../../constants/RewardNetworks";

export const findEnum = (network: string) => {
    if (network.toLocaleUpperCase() === "CARDANO") {
      return NetworksMultiplyFactor["CARDANO"];
    }
  
    return NetworksMultiplyFactor["DEFAULT"];
  }