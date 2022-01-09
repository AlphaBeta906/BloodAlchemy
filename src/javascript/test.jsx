import { useState, useContext } from "react";
import UserContext from "./userContext";

export default function Test() {
    const [result, setResult] = useState("");
    const { setUser } = useContext(UserContext);

    const handleClick = () => {
        setUser("");
        localStorage.removeItem("user");
        setResult("Done!");
    };

    return (
        <div>
            <button onClick={handleClick}>HEY</button>
            <p>{result}</p>
        </div>
    );
}