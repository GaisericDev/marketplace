import React, { useContext, useEffect, useState } from 'react'

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import {CoinbaseWalletSDK} from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';

const Web3Context = React.createContext();

export const useWeb3 = () => {
    return useContext(Web3Context);
}

export const Web3ContextProvider = ({children}) => {
    const [web3Provider, setWeb3Provider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [nft, setNFT] = useState({});
    const [marketplace, setMarketplace] = useState({});
    // Handle chain changed
    // useEffect(()=>{
    //     const chainChanged = window.ethereum.on('chainChanged', (chainId) => {
    //         window.location.reload();
    //     })
    //     return chainChanged;
    // }, []);
    // // Handle acc changed
    // useEffect(()=>{
    //     const accChanged = window.ethereum.on('accountsChanged', async () => {
    //         connectWallet(true);
    //     });
    //     return accChanged;
    // }, []);
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
    }

    // Load all contracts
    const loadContracts = async (signer) => {
        // Get deployed copies of contracts
        const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
        setMarketplace(marketplace)
        const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
        setNFT(nft)
    }

    // Handle chain changed
    window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
    })

    // Handle acc changed
    window.ethereum.on('accountsChanged', async () => {
        connectWallet(true);
    })

    useEffect(()=>{
        connectWallet(true);
        loadContracts(signer);
    },[]);
    // Export context
    const value = {
        providerOptions
        ,connectWallet
        ,loadContracts
        ,web3Provider
        ,setWeb3Provider
    }
  return (
    <Web3Context.Provider value={value}>
        {children}
    </Web3Context.Provider>
  )
}
