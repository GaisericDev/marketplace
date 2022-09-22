import React,{useState, useEffect, useRef} from 'react'
import "./Create.scss";
import {create as ipfsHttpClient} from 'ipfs-http-client'; 
import { useWeb3 } from '../context/Web3Context';
import { MediaUploadField } from './MediaUploadField';
import { NameField } from './NameField';
import { DescriptionField } from './DescriptionField';
import { PriceField } from './PriceFIeld';
import LoadingButton from '@mui/lab/LoadingButton';
import { NFTStorage, File, Blob } from 'nft.storage'

export const Create = (props) => {
  const NFT_STORAGE_TOKEN = import.meta.env.VITE_REACT_APP_NFT_STORAGE_TOKEN;
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const [img,setImg] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {connectWallet, web3Provider, fromWei, toWei, marketplace, nft} = useWeb3();
  // Upload NFT image to ipfs
  const uploadToIpfs = async () => {
    console.log("Uploading to ipfs...");
    const metadata = await client.store({
      image: file,
      name: name,
      description: description,
    });
    return metadata;
  }

  // Create the NFT on the blockchain
  const createNFT = async () => {
    if(!name || !price || !file || !description) return;
    try {
      const metadata = await uploadToIpfs();
      mintThenList(metadata);
    } catch (error) {
      console.log(`Ipfs uri upload error: ${error.message}`);
    }
  }

  // Mints NFT then lists on marketplace
  const mintThenList = async (metadata) => {
    const uri = metadata.url;
    console.log("token uri: ", uri);
    // mint nft 
    await(await nft.mint(uri)).wait()
    console.log("mint success");
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    console.log("Token count: ", id);
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
        <h1>{file ? "File uploaded" : "No file uploaded"}</h1>
        <h1>{name ? name : "No name"}</h1>
        <h1>{description ? description : "No description"}</h1>
        <h1>{price ? price : "No price"}</h1>
      </header>
      <form className="createForm">
        <p className={`labelDesc ${props.isDarkMode ? "darkLabel" : ""}`}>
          <span className='required'>*</span>
          Required fields
        </p>
        <MediaUploadField updateFile={(result)=>{setFile(result)}} isDarkMode={props.isDarkMode}></MediaUploadField>
        <NameField updateName={(result)=>{setName(result)}} isDarkMode={props.isDarkMode}></NameField>
        <DescriptionField updateDescription={(result)=>{setDescription(result)}} isDarkMode={props.isDarkMode}></DescriptionField>
        <PriceField updatePrice={(result) => setPrice(result)} isDarkMode={props.isDarkMode}></PriceField>
        <LoadingButton onClick={()=>{createNFT()}} loading={isLoading} variant="contained" disableElevation>
          Create
        </LoadingButton>
      </form>
    </div>
  )
}
