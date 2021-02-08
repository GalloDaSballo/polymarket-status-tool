import { mergePositions, splitPosition } from "@polymarket/sdk";
import { BigNumber } from "ethers";
import axios from "axios";
import {request, gql} from "graphql-request";

import {
  AMOUNT,
  CONDITIONAL_TOKENS_ADDRESS,
  CONDITION_ID,
  OUTCOME_SLOT_COUNT,
  USDC_ADDRESS,
  SUBGRAPH_STATUS_URL,
  SUBGRAPH_URL
} from "../constants";

import getProxyWalletFactory from "./proxyWalletFactory";

export const testSubgraph = async (provider: any) => {
  let subgraphTx = {}
  let graphHealth = {}
  try{
    const query = gql`{
        indexingStatusesForSubgraphName(subgraphName: "TokenUnion/polymarket"){
          synced
          health
          chains{
            latestBlock{
              number
            }
          }
        }
      }
    `

    console.log("query", query)
    const { indexingStatusesForSubgraphName } = await request(SUBGRAPH_STATUS_URL, query)

    graphHealth = {
      block: indexingStatusesForSubgraphName[0].chains[0].latestBlock.number,
      health: indexingStatusesForSubgraphName[0].health,
      synced: indexingStatusesForSubgraphName[0].synced
    }
  } catch(err) {

  }

  const subgraphRes = await axios({
    method: 'GET',
    url: SUBGRAPH_URL
  })
  
  try{
    // TODO Figure out subgraphTx
    // const proxyWalletFactory = getProxyWalletFactory(provider);

    // const split = splitPosition(
    //     CONDITIONAL_TOKENS_ADDRESS,
    //     USDC_ADDRESS,
    //     CONDITION_ID,
    //     OUTCOME_SLOT_COUNT,
    //     BigNumber.from(AMOUNT)
    //   )

    // await proxyWalletFactory.proxy(split);

    // const merge = mergePositions(
    //   CONDITIONAL_TOKENS_ADDRESS,
    //   USDC_ADDRESS,
    //   CONDITION_ID,
    //   OUTCOME_SLOT_COUNT,
    //   BigNumber.from(AMOUNT)
    // )
    // await proxyWalletFactory.proxy(merge);

  } catch(err) {}

  return {
    status: subgraphRes.status,
    health: graphHealth,
    lastUpdated: new Date(),
  }
};
