import { mergePositions, splitPosition } from "@polymarket/sdk";
import { BigNumber } from "ethers";

import {
  AMOUNT,
  CONDITIONAL_TOKENS_ADDRESS,
  CONDITION_ID,
  OUTCOME_SLOT_COUNT,
  USDC_ADDRESS,
} from "../constants";

import getProxyWalletFactory from "./proxyWalletFactory";

export const testSubgraph = async (provider: any) => {
  try{
    const proxyWalletFactory = getProxyWalletFactory(provider);
    console.log("proxyWalletFactory", proxyWalletFactory)
    const tx = splitPosition(
        CONDITIONAL_TOKENS_ADDRESS,
        USDC_ADDRESS,
        CONDITION_ID,
        OUTCOME_SLOT_COUNT,
        BigNumber.from(AMOUNT)
      )
    console.log("tx", tx)
    await proxyWalletFactory.proxy(tx);

    // mergePositions(
    //   CONDITIONAL_TOKENS_ADDRESS,
    //   USDC_ADDRESS,
    //   CONDITION_ID,
    //   OUTCOME_SLOT_COUNT,
    //   BigNumber.from(AMOUNT)
    // ),

    return {
      status: 200,
      lastUpdated: new Date(),
    }
  } catch(err) {
    return {
      status: 500,
      lastUpdated: new Date(),
      message: err.message
    }
  }
};
