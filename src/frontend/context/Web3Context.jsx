import React, { useContext, useEffect, useState } from 'react'

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import {CoinbaseWalletSDK} from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import NFTAbi from '../contractsData/NFT.json';
import NftAddress from '../contractsData/NFT-address.json';
const Web3Context = React.createContext();

export const useWeb3 = () => {
    return useContext(Web3Context);
}

export const Web3ContextProvider = ({children}) => {
    const [web3Provider, setWeb3Provider] = useState(null);
    const [signer, setSigner] = useState(null);
    const marketplaceAbi = MarketplaceAbi.abi;
    const marketplaceAddr = MarketplaceAddress.address;
    const [marketplace, setMarketplace] = useState({});
    const nftAbi = NFTAbi.abi;
    const nftAddr = NftAddress.address;
    const [nft, setNft] = useState({});
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
        try{
        let web3Modal = new Web3Modal({
            cacheProvider: useCache,
            providerOptions,
            
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
    }

    // Handle chain changed
    window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
    })

    // Handle acc changed
    window.ethereum.on('accountsChanged', async (accounts) => {
        if(accounts.length == 0){
           window.location.reload();
           return;
        }
        connectWallet(true);
    })

    // Logout
    const logout = async() => {
        localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
        window.location.reload();
    }

    // Convert string to bignumber to pass to contract
    const toWei = (num) => ethers.utils.parseEther(num.toString());

    // Convert bignumber to string from contract
    const fromWei = (num) => ethers.utils.formatEther(num, );

    // Load marketplace contract
    const loadMarketplace = async () => {
        if(web3Provider == null){return};
        if(signer == null){
            const signer = web3Provider.getSigner();
            setSigner(signer);
        }
        if(signer){
            const contract = new ethers.Contract(marketplaceAddr, marketplaceAbi, signer);
            if(contract){
                setMarketplace(contract);
            }
        }
    }
    // Load nft contract
    const loadNft = async () => {
        if(web3Provider == null){return};
        if(signer == null){
            const signer = web3Provider.getSigner();
            setSigner(signer);
        }
        if(signer){
            const contract = new ethers.Contract(nftAddr, nftAbi, signer);
            if(contract){
                setNft(contract);
            }
        }
    }

    // Connect wallet on load
    useEffect(()=>{
        connectWallet(true);
    },[]);

    // Load marketplace contract when we have a web3 provider
    useEffect(()=>{
        if(Object.keys(marketplace).length === 0){
            loadMarketplace();
            loadNft();
        } 
    },[web3Provider])

    // Export context
    const value = {
        providerOptions
        ,connectWallet
        ,web3Provider
        ,setWeb3Provider
        ,logout
        ,toWei
        ,fromWei
        ,toWei
        ,marketplace
        ,nft
    }
  return (
    <Web3Context.Provider value={value}>
        {children}
    </Web3Context.Provider>
  )
}
