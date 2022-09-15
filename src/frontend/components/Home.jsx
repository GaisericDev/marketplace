import React from 'react'
import "./Home.css";
import { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import Web3Modal from "web3modal";
import {CoinbaseWalletSDK} from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';
import { Button } from "@mui/material";
import { Spinner } from "react-bootstrap";
import { useWeb3 } from '../context/Web3Context';

export const Home = () => {
 
  const {connectWallet, web3Provider, fromWei, marketplace} = useWeb3();
  const [count, setCount] = useState("");

  // Get amount of items on marketplace
  const getItemCount = async () => {
    let itemCount = fromWei(await marketplace.itemCount());
    setCount(itemCount);
  }

  // Load item count when we have a marketplace contract
  useEffect(()=>{
    if(Object.keys(marketplace).length === 0){return;}
    getItemCount();
  }, [marketplace])

  return (
    <div className="content">
    {
      web3Provider == null ? (
        <Button onClick={()=>{connectWallet(false)}}>Open web3 modal</Button>
      ) : (
        <>
          <p>Connected!</p>
          <p>Address: {web3Provider.provider.selectedAddress}</p>
          <p>Item Count: {count}</p>
        </>
      )
    }
    </div>
  )
}
