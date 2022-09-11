import MarketplaceAbi from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'

import { useEffect, useState } from 'react'
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core";

import { WalletSelect } from './WalletSelect'
import { networkParams } from "../utils/networks";
import { connectors } from "../utils/connectors";
import Button from '@mui/material/Button';

import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})

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
      console.log(error.message);
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
  );
}

export default App;