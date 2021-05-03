import dotenv from "dotenv";
import { ethers } from "ethers";
import {
  MAINNET_RPC,
  POLYMARKET_MAINNET_URL,
  MATIC_URLS,
  MATICV2_URLS,
  POLYMARKET_MAINNET_ADDRES,
  MATIC_RPC,
  OUR_RECIPIENT_ADD
} from "./constants";
import { getBlockVigilData } from "./helpers/blockvigil";
import {
  getRecipientBalance,
  getRelayerBalance,
  getRelayerData,
  getV2RelayerData,
} from "./helpers/ethers";

dotenv.config();

const getBalance = async (): Promise<any> => {
  const maticProvider = new ethers.providers.JsonRpcProvider(
    MATIC_RPC
  );

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
  const v2Relayers = [];
  const maticRelayers = [];
  const maticV2Relayers = [];
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



  for (let url of MATICV2_URLS) {
    const v2Relayer = await getV2RelayerData(url);
    v2Relayers.push(v2Relayer);
  };

  for (let i = 0; i < v2Relayers.length; i++) {
    const gsnV2Balance = await getRelayerBalance(
      maticProvider,
      v2Relayers[i].address
    );
    const v2RelayerData: any = {
      balance: gsnV2Balance,
      isReady: v2Relayers[i].isReady,
      address: v2Relayers[i].address,
    };

    maticV2Relayers.push(v2RelayerData);
    };

    const maticData: any = {
      recipientBalance: maticRecipientBalance,
      address: OUR_RECIPIENT_ADD,
      relayers: maticRelayers,
      v2Relayers: maticV2Relayers,
      lastUpdated: new Date()
    };
  const blockVigilData = await getBlockVigilData();

  // output -> api data
  const data = {
    mainnet: mainnetData,
    matic: maticData,
    blockVigil: blockVigilData,
    lastUpdated: new Date()
  };
  console.log("data", data)

  return data;
};

export default getBalance;