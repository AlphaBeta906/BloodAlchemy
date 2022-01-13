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
            <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleClick}>HEY</button>
            <p>{result}</p>
        </div>
    );
}