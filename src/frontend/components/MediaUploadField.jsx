import React,{useEffect, useRef, useState} from 'react'
import ImageIcon from '@mui/icons-material/Image';

export const MediaUploadField = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileType, setSelectedFileType] = useState(null);
    const [fileSize, setFileSize] = useState(0);
    const [preview, setPreview] = useState();
    const [error, setError] = useState("");
    const [hasMultiMedia, setHasMultiMedia] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedCardFileType, setSelectedCardFileType] = useState(null);
    const [cardFileSize, setCardFileSize] = useState(0);
    const [cardError, setCardError] = useState("");
    const [cardPreview, setCardPreview] = useState(null);
    const audioRef = useRef(); 
    const videoRef = useRef();
  // Imgage preview file handler
  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined)
        return
    }

    // Set file and file type
    setSelectedFile(e.target.files[0])
    setSelectedFileType(e.target.files[0].type)

    // Set file size
    setFileSize(e.target.files[0].size / 1024 / 1024);
  } 

  // Allowed file types
  const allowedImages = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];
  const allowedAudio = ["audio/mpeg", "audio/ogg", "audio/wav"];
  const allowedVideo = ["video/webm", "video/mp4", "video/ogg"];
  const allowedFileTypes = allowedImages.concat(allowedAudio, allowedVideo);
  const allowedFileSizeMB = 10;
  useEffect(() => {
    setError("");
    setHasMultiMedia(false);
    setSelectedCard(null);
    setSelectedCardFileType(null);
    setCardPreview(null);
    if(selectedFile == null || undefined || ""){
      return;
    } 
    if(!allowedFileTypes.includes(selectedFileType)){
      setError(`File type ${selectedFileType} not allowed!`);
      return;
    } 
    if(fileSize > allowedFileSizeMB){
      setError(`File of size ${fileSize} exceeds the allowed ${allowedFileSizeMB}MB limit!`);
      return;
    }
    // create the preview
    const blob = new Blob([selectedFile], {type: selectedFileType});
    const objectUrl = URL.createObjectURL(blob);
    setPreview(objectUrl);

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
    // pass file to parent
    props.updateFile(selectedFile);
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

    // Set file size
    setCardFileSize(e.target.files[0].size / 1024 / 1024);
  } 

  useEffect(() => {
    setCardError("");
    if(selectedCard == null || undefined || "") return;
    if(!allowedImages.includes(selectedCardFileType)) setCardError(`File type ${selectedCardFileType} not allowed!`);
    if(cardFileSize > allowedFileSizeMB){setCardError(`File of size ${cardFileSize} exceeds the allowed ${allowedFileSizeMB}MB limit!`)};
    // create the preview
    const objectUrl = URL.createObjectURL(new Blob([selectedCard], {type: selectedCardFileType}));
    setCardPreview(objectUrl);
 
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedCard])

  return (
    <>
    <div className="formField">
          <div className="labelWrap">
            <label className='label'>Image, Video, or Audio</label>
            <span className="labelDesc">File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG. Max size: 100 MB</span>
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
              {cardError && <span className="labelDesc cardError">{cardError}</span>}
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
    </>
  )
}
