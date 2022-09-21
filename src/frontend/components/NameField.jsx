import React,{useState} from 'react'

export const NameField = (props) => {
    const [error, setError] = useState(false);
  return (
    <div className="formField">
        <div className="labelWrap">
        <label className='label'>Name</label>
        {error && <span className="labelDesc error">{error}</span>}
        </div>
        <div className={`inputWrap ${props.isDarkMode ? "inputDark" : ""}`}>
            <input type="text" autoCapitalize='off' autoComplete='off' autoCorrect='off' name="name" required spellCheck='false' placeholder='Item name'/>
        </div>
    </div>
  )
}
