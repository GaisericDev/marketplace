import React,{useState} from 'react'

export const DescriptionField = (props) => {
    const [error, setError] = useState(false);
  return (
    <div className="formField">
        <div className="labelWrap">
        <label className='label'>Description</label>
        <span className="labelDesc">The description will be included on the item's detail page underneath its image.</span>
        {error && <span className="labelDesc error">{error}</span>}
        </div>
        <div className={`inputWrap ${props.isDarkMode ? "inputDark" : ""}`}>
            <textarea name="description" rows="4" placeholder='Provide a detailed description of your item.'></textarea>
        </div>
    </div>
  )
}
