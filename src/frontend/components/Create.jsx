import React,{useState, useEffect, useRef} from 'react'
import "./Create.scss";
import {create as ipfsHttpClient} from 'ipfs-http-client'; 
import { useWeb3 } from '../context/Web3Context';
import ImageIcon from '@mui/icons-material/Image';

export const Create = (props) => {
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
  const [img,setImg] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [preview, setPreview] = useState();
  const [error, setError] = useState("");
  const [hasMultiMedia, setHasMultiMedia] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardFileType, setSelectedCardFileType] = useState(null);
  const [cardError, setCardError] = useState("");
  const [cardPreview, setCardPreview] = useState(null);
  const audioRef = useRef(); 
  const videoRef = useRef();
  const {connectWallet, web3Provider, fromWei, marketplace, nft} = useWeb3();
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

  // Mints NFT then lists on marketplace
  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }

  // Imgage preview file handler
  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined)
        return
    }

    // Set file and file type
    setSelectedFile(e.target.files[0])
    setSelectedFileType(e.target.files[0].type)
  } 

  // Allowed file types
  const allowedImages = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  const allowedAudio = ["audio/mpeg", "audio/ogg", "audio/wav"];
  const allowedVideo = ["video/webm", "video/mp4", "video/ogg"];
  const allowedFileTypes = allowedImages.concat(allowedAudio, allowedVideo);

  useEffect(() => {
    setError("");
    setHasMultiMedia(false);
    setSelectedCard(null);
    setSelectedCardFileType(null);
    setCardPreview(null);
    if(selectedFile == null || undefined || "") return;
    if(!allowedFileTypes.includes(selectedFileType)) setError(`File type ${selectedFileType} not allowed!`);
    
    // create the preview
    const objectUrl = URL.createObjectURL(new Blob([selectedFile], {type: selectedFileType}));
    setPreview(objectUrl)

    // handle audio
    if(selectedFileType.includes("audio")){
      setHasMultiMedia(true);
      audioRef.current.load();
    }

    // handle video
    if(selectedFileType.includes("video")){
      setHasMultiMedia(true);
      videoRef.current.load();
    }
 
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile])

  // Card image preview file handler
  const onSelectCard = e => {
    if (!e.target.files || e.target.files.length === 0) {
        setSelectedCard(undefined)
        return
    }

    // Set file and file type
    setSelectedCard(e.target.files[0])
    setSelectedCardFileType(e.target.files[0].type)
  } 

  useEffect(() => {
    setCardError("");
    if(selectedCard == null || undefined || "") return;
    if(!allowedImages.includes(selectedCardFileType)) setError(`File type ${selectedCardFileType} not allowed!`);
    
    // create the preview
    const objectUrl = URL.createObjectURL(new Blob([selectedCard], {type: selectedCardFileType}));
    setCardPreview(objectUrl);
 
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedCard])

  return (
    <div className="create">
      <header className="title">
        <h1 className="titleH1">Create New Item</h1>
      </header>
      <form className="createForm">
        <p className={`labelDesc ${props.isDarkMode ? "darkLabel" : ""}`}>
          <span className='required'>*</span>
          Required fields
        </p>
        <div className="formField">
          <div className="labelWrap">
            <label className='label'>Image, Video, Audio, or 3D Model</label>
            <span className="labelDesc">File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG,
            GLB, GLTF. Max size: 100 MB</span>
            {error && <span className="labelDesc error">{error}</span>}
          </div>
          <label className="fileLabel" htmlFor="media">
            <div className={`fileUpload ${props.isDarkMode && "placeHolderDark"}`}>
              <input id="media" name="media" type="file" tabIndex="-1" onChange={onSelectFile}></input>
              {selectedFile ?
               <>
                {allowedAudio.includes(selectedFileType) &&
                  <audio controls controlsList="nodownload" loop preload="auto" ref={audioRef}>
                    <source src={preview} type={selectedFileType} />
                  </audio>
                }
                {allowedVideo.includes(selectedFileType) && 
                  <video controls controlsList="nodownload" loop preload="auto" ref={videoRef} className="previewVideo">
                    <source src={preview} type={selectedFileType}></source>
                  </video>
                }
                {allowedImages.includes(selectedFileType) && <img className="previewImg" src={preview}></img>}
               </>
               :
               <ImageIcon className="previewPlaceholder" sx={{height: 84, width: 84, color: "#cccccc"}}></ImageIcon>
              }
              {
                hasMultiMedia && 
                <div className={`changer ${props.isDarkMode && "darkLabel"}`}>
                  Change
                </div>
              }
            </div>
          </label>
        </div>

        {
          hasMultiMedia &&
          <div className="formField">
            <div className="labelWrap">
              <label className='label'>Preview Image</label>
              <span className="labelDesc">Because you've included multimedia, you'll need to provide an image (PNG, JPG, or GIF) for the card display of your item.</span>
            </div>
            <label className="fileLabel" htmlFor="card">
              <div className={`fileUpload card ${props.isDarkMode && "placeHolderDark"}`}>
                <input id="card" name="card" type="file" accept="image/*" tabIndex="-1" onChange={onSelectCard}></input>
                {
                  selectedCard ? 
                  allowedImages.includes(selectedCardFileType) && <img className="previewImg" src={cardPreview}></img>
                  :
                  <ImageIcon className="cardPlaceholder" sx={{height: 84, width: 84, color: "#cccccc"}}></ImageIcon>
                }
              </div>
            </label>
          </div>
        }
      </form>
    </div>
  )
}
