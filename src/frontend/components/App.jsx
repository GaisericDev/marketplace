import MarketplaceAbi from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'

import { useEffect, useState } from 'react'
import { ethers } from "ethers"
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";

import { WalletSelect } from './WalletSelect'

import Button from '@mui/material/Button';

import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})

  // Network config
  const networks = {
    31337: "Localhost network",
    1: "Ethereum mainnet",
    4: "Rinkeby testnet"
  }
  const networkId = 1;

  // Get web3 react library
  const getLibrary = (provider) => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 8000; // frequency provider is polling
    return library;
  };

  // Web3-react hook
  const {
    library,
    chainId,
    account,
    activate,
    deactivate,
    active
  } = useWeb3React();

  // Connect browser to blockchain request
  const initWeb3 = async () => {
    setLoading(true);
    setError("");
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      loadContracts(signer);
    }
    catch(error){
      setError(error.message);
    }
    finally{
      setLoading(false);
    }
  }

  // Load contracts
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
  }
  
  // Connect wallet button click handlers
  const [open, setOpen] = useState(false);

  // On load
  useEffect(()=>{
    initWeb3();
  }, [])

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        { /* Connect Wallet */
        active
          ?
          account
          :
          <Button
            variant="contained"
            size="large"
            onClick={()=>{setOpen(true)}}
          >
              CONNECT WALLET
          </Button>
        }

        {/* Wallet Select Modal */}
        <WalletSelect open={open} setOpen={setOpen}></WalletSelect>
      </div>
    </Web3ReactProvider>
  );
}

export default App;