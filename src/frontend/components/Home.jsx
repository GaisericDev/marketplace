import React from 'react'
import "./Home.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
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
    const {providerOptions, connectWallet, loadContracts, web3Provider, setWeb3Provider} = useWeb3();

  return (
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
    </div>
  )
}
