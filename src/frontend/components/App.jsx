import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import {CoinbaseWalletSDK} from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";

import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';
import { Navbar } from "./Navbar";

import { Button } from "@mui/material";
import { Spinner } from "react-bootstrap";

import "./App.css";

function App() {

  const [web3Provider, setWeb3Provider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  const [loading, setLoading] = useState(true);

  // Handle chain changed
  window.ethereum.on('chainChanged', (chainId) => {
    window.location.reload();
  })

  // Handle acc changed
  window.ethereum.on('accountsChanged', async () => {
    connectWallet(true);
  })

  // Web3Modal provider options
  const providerOptions = {
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

  // Connect wallet using web3modal
  const connectWallet = async (useCache) => {
    setLoading(true);
    try{
      let web3Modal = new Web3Modal({
        cacheProvider: useCache,
        providerOptions
      });
      const web3ModalInstance = await web3Modal.connect();
      const web3ModalProvider = new ethers.providers.Web3Provider(web3ModalInstance);
      if(web3ModalProvider){
        setWeb3Provider(web3ModalProvider);
        const signer = web3ModalProvider.getSigner();
        if(signer){
          setSigner(signer)
        }
        else{
          console.log("No signer");
        }
      }
    }
    catch(error){
      console.log(error.message);
    }
    finally{
      setLoading(false);
    }
  }

  // Load all contracts
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
    setLoading(false);
  }

  // On load
  useEffect(()=>{
    setLoading(true);
    connectWallet(true);
    loadContracts(signer);
  },[]);


  return (
      <div className="App">
        <Navbar></Navbar>
        <div className="content">
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
          {
            loading ? (
              <>
                <Spinner animation="border" className="spinner" />
                <p>Awaiting Metamask Connection...</p>
              </>
            ) : (
              <p>Content</p>
            )
          }
        </div>
      </div>
  );
}

export default App;