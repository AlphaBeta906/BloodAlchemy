import { useState, useEffect } from "react";

export default function Test() {
    const [seconds, setSeconds] = useState(0);
    const [result, setResult] = useState("");

    const handleClick = () => {
        if (seconds === 0) {
            setSeconds(10);
            setResult("Pressed!");
        } else {
            setResult(`Please wait ${seconds} seconds`);
        }
    };
  
    useEffect(() => {
        if (seconds > 0) {
            setTimeout(() => setSeconds(seconds - 1), 1000);
        } else {
            setSeconds(0);
        }
    }, [seconds]);
  
    return (
        <div>
            <button onClick={handleClick}>HEY</button>
            <p>{result}</p>
        </div>
    );
}