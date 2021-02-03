import dotenv from "dotenv";
import { ethers } from "ethers";
import {
  MAINNET_RPC,
  POLYMARKET_MAINNET_URL,
  MATIC_URLS,
  POLYMARKET_MAINNET_ADDRES,
  MATIC_RPC,
  OUR_RECIPIENT_ADD
} from "./constants";
import { getBlockVigilData } from "./helpers/blockvigil";
import {
  getRecipientBalance,
  getRelayerBalance,
  getRelayerData,
} from "./helpers/ethers";
import { testSubgraph } from "./helpers/subgraph";

dotenv.config();

const getBalance = async (): Promise<any> => {
  const maticProvider = new ethers.providers.JsonRpcProvider(
    MATIC_RPC
  );
  const subgraphData = await testSubgraph(maticProvider); // WIP

  const mainnetProvider = new ethers.providers.JsonRpcProvider(MAINNET_RPC);

  const mainnetRecipientBalance = await getRecipientBalance(mainnetProvider);

  const relayerBalance = await getRelayerBalance(
    mainnetProvider,
    POLYMARKET_MAINNET_ADDRES
  );
  const relayer = await getRelayerData(POLYMARKET_MAINNET_URL);

  const mainnetData = {
    recipientBalance: mainnetRecipientBalance,
    address: OUR_RECIPIENT_ADD,
    relayers: [
      {
        balance: relayerBalance,
        isReady: relayer.isReady,
        address: relayer.address,
      },
    ],
    lastUpdated: new Date()
  };

  const relayers = [];
  const maticRelayers = [];
  const maticRecipientBalance = await getRecipientBalance(maticProvider);



  for (let url of MATIC_URLS) {
    const relayer = await getRelayerData(url);
    relayers.push(relayer);
  }

  for (let i = 0; i < relayers.length; i++) {
    const gsnBalance = await getRelayerBalance(
      maticProvider,
      relayers[i].address
    );

    const relayerData: any = {
      balance: gsnBalance,
      isReady: relayers[i].isReady,
      address: relayers[i].address,
    };

    maticRelayers.push(relayerData);
  }

  const maticData: any = {
    recipientBalance: maticRecipientBalance,
    address: OUR_RECIPIENT_ADD,
    relayers: maticRelayers,
    lastUpdated: new Date()
  };

  const blockVigilData = await getBlockVigilData();

  // output -> api data
  const data = {
    mainnet: mainnetData,
    matic: maticData,
    blockVigil: blockVigilData,
    subgraph: subgraphData,
    lastUpdated: new Date()
  };
  console.log("data", data)

  return data;
};

export default getBalance;