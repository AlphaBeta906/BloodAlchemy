import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./userContext";

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
            <h1>Sign Out</h1>
            <button onClick={handleClick}>Sign-Out</button>
        </center>
        {result}
    </div>);
}