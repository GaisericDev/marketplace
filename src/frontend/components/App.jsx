import { Button } from "@mui/material";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import {CoinbaseWalletSDK} from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { useState } from "react";
import { useEffect } from "react";

function App() {

  const [web3Provider, setWeb3Provider] = useState(null);

  // Handle chain changed
  window.ethereum.on('chainChanged', (chainId) => {
    window.location.reload();
  })

  // Handle acc changed
  window.ethereum.on('accountsChanged', async () => {
    connectWallet(true);
  })

  const providerOptions = {
    /* See Provider Options Section */
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
      appName: "NFT Marketplace",
      infuraId: {1: import.meta.env.VITE_REACT_APP_INFURA_ID, 4: import.meta.env.VITE_REACT_APP_INFURA_ID}
      }
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: import.meta.env.VITE_REACT_APP_INFURA_ID
      }
    }
  };
  const connectWallet = async (useCache) => {
    try{
      let web3Modal = new Web3Modal({
        cacheProvider: useCache,
        providerOptions
      });
      const web3ModalInstance = await web3Modal.connect();
      const web3ModalProvider = new ethers.providers.Web3Provider(web3ModalInstance);
      if(web3ModalProvider){
        setWeb3Provider(web3ModalProvider);
      }
    }
    catch(error){
      console.log(error.message);
    }
  }

  useEffect(()=>{
    connectWallet(true);
  },[]);


  return (
      <div className="App">
        {
          web3Provider == null ? (
            <Button onClick={()=>{connectWallet(false)}}>Open web3 modal</Button>
          ) : (
            <>
              <p>Connected!</p>
              <p>Address: {web3Provider.provider.selectedAddress}</p>
            </>
          )
        }
      </div>
  );
}

export default App;