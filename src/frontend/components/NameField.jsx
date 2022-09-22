import React,{useState, useRef} from 'react'

export const NameField = (props) => {
    const [error, setError] = useState(false);
    const nameField = useRef();
    const checkName = () => {
      setError("");
      let name = nameField.current.value;
      // Name must not be empty
      if(name.trim().length <= 0){
        setError("Invalid name!");
        return;
      }
      // Name must not be longer than 25 characters
      if(name.length > 25){
        setError("Name is longer than 25 characters");
        return;
      }
      // Pass name to parent component
      props.updateName(name);
    }
  return (
    <div className="formField">
        <div className="labelWrap">
        <label className='label'>Name</label>
        {error && <span className="labelDesc error">{error}</span>}
        </div>
        <div className={`inputWrap ${props.isDarkMode ? "inputDark" : ""}`}>
            <input onChange={()=>{checkName()}} ref={nameField} type="text" autoCapitalize='off' autoComplete='off' autoCorrect='off' name="name" required spellCheck='false' placeholder='Item name'/>
        </div>
    </div>
  )
}
