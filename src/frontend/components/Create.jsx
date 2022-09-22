import React,{useState, useEffect, useRef} from 'react'
import "./Create.scss";
import {create as ipfsHttpClient} from 'ipfs-http-client'; 
import { useWeb3 } from '../context/Web3Context';
import { MediaUploadField } from './MediaUploadField';
import { NameField } from './NameField';
import { DescriptionField } from './DescriptionField';
import { PriceField } from './PriceFIeld';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

export const Create = (props) => {
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
  const [img,setImg] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {connectWallet, web3Provider, fromWei, toWei, marketplace, nft} = useWeb3();
  // Upload NFT image to ipfs
  const uploadToIpfs = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if(typeof(file) != 'undefined'){
      try { 
        const result = await client.add(file);
        console.log(result);
        setImg(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (error) {
        console.log(`Ipfs image upload error: ${error.message}`);
      }
    }
  }

  // Create the NFT on the blockchain
  const createNFT = async () => {
    // if (!img || !price || !name || !description) return;
    if(!price) return;
    try {
      // const result = await client.add(JSON.stringify({img, name, description}));
      const result = "testuri"
      mintThenList(result);
    } catch (error) {
      console.log(`Ipfs uri upload error: ${error.message}`);
    }
  }

  // Mints NFT then lists on marketplace
  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    console.log("minting nft...");
    // mint nft 
    await(await nft.mint(uri)).wait()
    console.log("mint success");
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = toWei(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }


  return (
    <div className="create">
      <header className="title">
        <h1 className="titleH1">Create New Item</h1>
        <h1>Price: {price}</h1>
      </header>
      <form className="createForm">
        <p className={`labelDesc ${props.isDarkMode ? "darkLabel" : ""}`}>
          <span className='required'>*</span>
          Required fields
        </p>
        <MediaUploadField isDarkMode={props.isDarkMode}></MediaUploadField>
        <NameField isDarkMode={props.isDarkMode}></NameField>
        <DescriptionField isDarkMode={props.isDarkMode}></DescriptionField>
        <PriceField updatePrice={(result) => setPrice(result)} isDarkMode={props.isDarkMode}></PriceField>
        <LoadingButton onClick={()=>{createNFT()}} loading={isLoading} variant="contained" disableElevation>
          Create
        </LoadingButton>
      </form>
    </div>
  )
}
