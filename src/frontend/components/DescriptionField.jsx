import React,{useState, useRef} from 'react'

export const DescriptionField = (props) => {
    const [error, setError] = useState(false);
    const descriptionField = useRef();

    const checkDescription = () => {
      setError("");
      let description = descriptionField.current.value;
      // Description cannot be empty
      if(description.trim().length <= 0){
        setError("Invalid description!");
        return;
      }
      // Description cannot be more than 1000 characters
      if(description.length > 1000){
        setError("Description cannot be longer than 1000 characters!");
        return;
      }
      // Pass description to parent
      props.updateDescription(description);
    }
  return (
    <div className="formField">
        <div className="labelWrap">
        <label className='label'>Description</label>
        <span className="labelDesc">The description will be included on the item's detail page underneath its image.</span>
        {error && <span className="labelDesc error">{error}</span>}
        </div>
        <div className={`inputWrap ${props.isDarkMode ? "inputDark" : ""}`}>
            <textarea onChange={()=>{checkDescription()}} ref={descriptionField} name="description" rows="4" placeholder='Provide a detailed description of your item.'></textarea>
        </div>
    </div>
  )
}
