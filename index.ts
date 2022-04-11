import axios from 'axios';

const API_URL = 'https://api.marduk.exchange:9001';

export const getVersion = () => {
  return axios.get(`${API_URL}/version`);
};

/**
 * To work with the instance one first has to know what pairs are supported and what kind of rates,
 * limits and fees can be expected when creating a new swap.
 * To get that kind of information the following call is used
 */
export const getRates = () : Promise<object> =>  {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/getpairs`)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch(reject);
  });
}

/**
 * This endpoint allows you to query the node public keys and URIs of the Lightning nodes run by Boltz.
 */
export const getNodes = (): Promise<object> =>  {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/getnodes`)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch(reject);
  });
}

/**
 * Marduk Swaps have different timeouts for each pair.
 * This endpoint allows querying those timeouts denominated in blocks of the base and quote chain.
 */
export const getTimeouts = (): Promise<object> =>  {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/gettimeouts`)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch(reject);
  });
}

/**
 * To query the addresses of the contracts Boltz uses on account based chains this endpoint must be queried.
 */
export const getContracts = (): Promise<object> =>  {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/getcontracts`)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch(reject);
  });
}

/**
 * Boltz provides an API endpoint that returns fee estimations for all chains that are configured on that instance.
 * These fee estimations are not enforced by Boltz and are just a recommendation.
 * For UTXO based chains like Bitcoin it is important to mention that if 0-conf wants to be used with normal swaps,
 * the lockup transaction has to have at least 80% of the recommended sat/vbyte value.
 * One can read more about the what and why in the 0-confirmation docs.
 * If the instance supports Ether or ERC20 tokens, only ETH will be in the response.
 * This value is for the Ethereum chain and not the Ether asset and denominated in GWEI.
 */
export const getFeeEstimation = () :  Promise<object> =>  {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/getfeeestimation`)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch(reject);
  });
}

/**
 * The Boltz API also allows for querying raw transactions for all supported UTXO based chains.
 * Irrespective of whether the transactions are still in the mempool or already included in a block;
 *
 * Boltz should find them either way. But it should be noted that unlike SPV and Neutrino servers,
 * Boltz doesn't provide any kind of proof that the transaction was included in a block.
 *
 * Requests querying for transactions have to be POST and contain two arguments in its JSON encoded body:
 * @param currency
 * @param transactionId
 */
export const getTransaction = (currency: string, transactionId: string): Promise<object> =>  {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/gettransaction`, {
        currency,
        transactionId,
      })
      .then((resp) => {
        resolve(resp.data);
      })
      .catch(reject);
  });
}

/**
 * Requests querying the lockup transactions on UTXO based chains of Submarine Swaps have to be POST and contain one argument in its JSON encoded body:
 * @param id
 */
export const getSwaptransaction = (id: string) => {
  return axios.post(`${API_URL}/getswaptransaction`, {
    id,
  });
};

/**
 * This endpoint is really similar to the one for querying transactions (and it works only on UTXO based chains too).
 * But instead of getting existing transactions this one will broadcast new ones to the network.
 * Also it returns the id of the broacasted transaction.
 * Requests broadcasting transactions have to be POST and contain two arguments in its JSON encoded body:
 * @param currency
 * @param transactionHex
 */
export const broadcastTransaction = (currency: string, transactionHex: string) => {
  return axios.post(`${API_URL}/broadcasttransaction`, {
    currency,
    transactionHex,
  });
};

/**
 * Before being able to handle the status events of this method it is recommended to read: Swap lifecycle https://docs.boltz.exchange/en/latest/lifecycle/
 *
 * To query the status of a swap one can use this endpoint which returns a JSON object containing the status of the swap.
 * All the possible status events are documented here.
 *
 * Requests querying the status of a swap have to be POST and contain a single value in its JSON encoded body:
 * @param id
 */
export const getSwapStatus = (id: string) => {
  return axios.post(`${API_URL}/swapstatus`, {
    id,
  });
};

/**
 * Creating reverse swaps (lightning to onchain coins) is pretty similar to creating normal ones.
 * Similarly, the requests and responses also slightly change based on the coin or token you are swapping from.
 * Keep in mind that Boltz uses 10 ** -8 as denomination in the API.
 * @param currency
 * @param amount
 * @param cb
 */
export const createSwap = (currency: string, amount: string, cb: string) :  Promise<object> =>  {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/createswap`)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch(reject);
  });
}

/**
 * When sending onchain coins before setting the invoice of a Submarine Swap,
 * you need to use this endpoint to figure out what the amount of the invoice you set should be.
 * Send a POST request with a JSON encoded body with this value:
 */
export const getSwapRates= () :  Promise<object> =>  {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/swaprates`)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch(reject);
  });
}

/**
 * In case the amount to be swapped is not known when creating the Submarine Swap,
 * the invoice can be set afterward and even if the onchain coins were sent already.
 * Please keep in mind that the invoice of a Submarine Swap has to have the same preimage hash that was specified when creating the Submarine Swap.
 * Although the invoice can be changed after setting it initially, this enpoint will only work if Boltz did not try to pay the initial invoice yet.
 * Requests to this endpoint have to be POST and should have the following values in its JSON encoded body:
 * @param id
 * @param invoice
 */
export const setInvoice = (id: string, invoice: string) :  Promise<object> =>  {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/setinvoice`, {
        id,
        invoice,
      })
      .then((resp) => {
        resolve(resp.data);
      })
      .catch(reject);
  });
}