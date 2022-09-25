import React,{useState, useEffect, useRef} from 'react'
import "./Create.scss";
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
  const [media, setMedia] = useState(null);
  const [mediaImg, setMediaImg] = useState(null);
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {connectWallet, web3Provider, fromWei, toWei, marketplace, nft} = useWeb3();
  // Upload NFT image to ipfs
  const uploadToIpfs = async () => {
    console.log("Uploading to ipfs...");
    let nft = {};
    if(media != null || undefined){
      // has multimedia
      nft = {
        image: mediaImg, // reserve 100 chars
        name: name, // reserve 25 chars
        description: description, // reserve 1000 chars
        media: media, // total 1125 chars reserved => base64 string cannot be larger than 2097152 - 1125 = 2096027 chars, let's make that 2090000 for safety
      }
    }
    else{
      // has no multimedia
      nft = {
        image: file,
        name: name,
        description: description
      }
    }
    //check if nft json string is not too large
    if(JSON.stringify(nft).length >= 2097152){
      throw "An nft object cannot be a string larger than 2097152 chars";
      return;
    }
    let res = await client.store(nft);
    let uri = res.url;
    return uri;
  }

  // Create the NFT on the blockchain
  const createNFT = async () => {
    if(!name || !price || !file || !description) return;
    try {
      const uri = await uploadToIpfs();
      await mintThenList(uri);
      console.log("Finished");
    } catch (error) {
      console.log(`Ipfs uri upload error: ${error.message}`);
    }
  }

  // Mints NFT then lists on marketplace
  const mintThenList = async (uri) => {
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
        <h1>{mediaImg ? "Media img uploaded" : "No media img uploaded"}</h1>
      </header>
      <form className="createForm">
        <p className={`labelDesc ${props.isDarkMode ? "darkLabel" : ""}`}>
          <span className='required'>*</span>
          Required fields
        </p>
        <MediaUploadField updateMediaImg={(result)=>{setMediaImg(result)}} updateMedia={(result)=>{setMedia(result)}} updateFile={(result)=>{setFile(result)}} isDarkMode={props.isDarkMode}></MediaUploadField>
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
