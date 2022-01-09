import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./userContext";

export default function Signout() {
    const [output, setOutput] = useState("");
    const { setUser } = useContext(UserContext);

    setOutput(<div>
        <center>
            <h1>Sign Out</h1>
            <button onClick={handleClick}>Sign-Out</button>
        </center>
    </div>);

    const handleClick = () => {
        setUser("");
        localStorage.removeItem("user");
        setOutput(
            <Navigate to="/" />
        )
    };

    return output;
}