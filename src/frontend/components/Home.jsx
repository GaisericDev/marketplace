import React from 'react'
import "./Home.css";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useWeb3 } from '../context/Web3Context';

export const Home = () => {
 
  const {connectWallet, web3Provider, fromWei, marketplace} = useWeb3();
  const [count, setCount] = useState("");
  const [error, setError] = useState("");
  // Get amount of items on marketplace
  const getItemCount = async () => {
    try{
      setError(""); 
      let itemCount = fromWei(await marketplace.itemCount());
      setCount(itemCount);
    }
    catch(error){
      setError(error.message);
    }
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
          {error && `Error: ${error}`}
        </>
      )
    }
    </div>
  )
}
