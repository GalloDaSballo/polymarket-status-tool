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

export const subgraph = async (provider: any) => {
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
};
