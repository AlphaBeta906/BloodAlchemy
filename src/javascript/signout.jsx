import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./userContext";
import Ads from './ads';

export default function Signout() {
    const [result, setResult] = useState("");
    const { setUser } = useContext(UserContext);

    const handleClick = () => {
        setUser("");
        localStorage.removeItem("user");
        setResult(
            <Navigate to="/" />
        )
    };

    return (<div>
        <center>
            <p class="text-2xl">Sign Out</p>
            <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleClick}>Sign-Out</button>
        </center>
        {result}

        <footer>
            <Ads/><br/>
        </footer>
    </div>);
}