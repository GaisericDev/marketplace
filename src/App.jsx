import './App.css'
import {ethers} from 'ethers';
import {useState, useEffect} from "react";
import MarketplaceAbi from "./frontend/contractsData/Marketplace.json"
import MarketplaceAddress from "./frontend/contractsData/Marketplace-address.json"
import NftAbi from "./frontend/contractsData/NFT.json";
import NftAddress from "./frontend/contractsData/NFT-address.json";

function App() {
  const [loading ,setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNft] = useState({});
  const [marketplace, setMarketplace] = useState({});
  // Metamask login / connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    setAccount(accounts[0]);
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    loadContracts(signer);
  }

  const loadContracts = async (signer) => {
    // Get deployed contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NftAddress.address, NftAbi.abi, signer);
    setNft(nft);
    setLoading(false);
  }

  useEffect(()=>{
    web3Handler();
  }, []);
  return (
    <div className="App">
      <div>{loading ? "Loading..." : marketplace.address}</div>
    </div>
  )
}

export default App
