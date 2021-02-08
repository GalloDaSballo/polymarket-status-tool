import axios from "axios";
import { BLOCKVIGIL_RPC } from "../constants";

export const getBlockVigilData = async (): Promise<any> => {
  try {
    const res1 = await axios.post(BLOCKVIGIL_RPC, {
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: [],
      id: 1,
    });

    if (!res1.data.result) {
      throw new Error("Block number was not returned");
    }

    const res2 = await axios.post(BLOCKVIGIL_RPC, {
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber",
      params: [res1.data.result, true],
      id: 1,
    });

    const timestamp = res2.data?.result?.timestamp;

    if (!timestamp) {
      throw new Error("Timestamp was not returned");
    }

    const blockVigilData = {
      status: res1.status,
      block: Number(res1.data.result),
      lastUpdated: new Date(timestamp * 1000),
    };

    return blockVigilData;
  } catch (err) {
    console.log("BLOCK VIGIL REQUEST FAILED", err.response.data);
  }
};
