import { Contract, ethers } from "ethers";
import proxyWalletFactoryABI from "../abi/ProxyWalletFactory.json";

import { PROXY_WALLET_FACTORY_ADDRESS } from "../constants";

const getProxyWalletFactory = (provider: any): Contract => {
  const { WALLET_PK } = process.env;

  if (!WALLET_PK) {
    throw new Error("WALLET_PK is not provided");
  }

  const wallet = new ethers.Wallet(WALLET_PK, provider);

  const proxyWalletFactory = new Contract(
    PROXY_WALLET_FACTORY_ADDRESS,
    proxyWalletFactoryABI,
    wallet
  );

  return proxyWalletFactory;
};

export default getProxyWalletFactory;
