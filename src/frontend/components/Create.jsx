import React,{useState} from 'react'
import "./Create.css";
import {create as ipfsHttpClient} from 'ipfs-http-client'; 

export const Create = () => {
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
  const [img,setImg] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

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
    if (!img || !price || !name || !description) return;
    try {
      const result = await client.add(JSON.stringify({img, name, description}));
      mintThenList(result);
    } catch (error) {
      console.log(`Ipfs uri upload error: ${error.message}`);
    }
  }
  return (
    <div>Create</div>
  )
}
