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

  await proxyWalletFactory.proxy([
    splitPosition(
      CONDITIONAL_TOKENS_ADDRESS,
      USDC_ADDRESS,
      CONDITION_ID,
      OUTCOME_SLOT_COUNT,
      BigNumber.from(AMOUNT)
    ),
    mergePositions(
      CONDITIONAL_TOKENS_ADDRESS,
      USDC_ADDRESS,
      CONDITION_ID,
      OUTCOME_SLOT_COUNT,
      BigNumber.from(AMOUNT)
    ),
  ]);
};
