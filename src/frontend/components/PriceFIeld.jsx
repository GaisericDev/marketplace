import React,{useState, useRef} from 'react'

export const PriceField = (props) => {
    const [error, setError] = useState(false);
    const priceInput = useRef();
    // Check if valid input
    const checkPrice = () => {
        setError("");
        let input = priceInput.current.value;
        // True if is a number or contains a "."
        let isNumber = /^\d*\.?\d*$/.test(input);
        // True if has spaces
        let hasSpaces = input.includes(" ");
        // True if is empty
        let isEmpty = input.length <= 0;
        // True if starts with a "."
        let startsWithDot = input[0] == "."
        // True if starts with "0", not followed by "." (If starts with 0, must be followed by a "." i.e. 0.3)
        let invalidZero = (input[0] == "0" && input[1] != "." && input.length > 1);
        if(!isNumber || hasSpaces || isEmpty || startsWithDot || invalidZero){
            setError("Invalid price");
            return;
        }
        // Number should be in allowed format, pass price to parent component
        props.updatePrice(input);
    }
  return (
    <div className="formField">
        <div className="labelWrap">
        <label className='label'>Price</label>
        <span className="labelDesc">Your desired price in ETH</span>
        {error && <span className="labelDesc error">{error}</span>}
        </div>
        <div className={`inputWrap ${props.isDarkMode ? "inputDark" : ""}`}>
            <input onChange={()=>{checkPrice()}} ref={priceInput} type="text" autoCapitalize='off' autoComplete='off' autoCorrect='off' name="price" required spellCheck='false' placeholder='1' inputMode='numeric'/>
        </div>
    </div>
  )
}
