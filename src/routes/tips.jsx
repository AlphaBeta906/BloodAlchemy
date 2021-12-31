import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Tips() {
    const [tip, setTip] = useState("");
    let location = useLocation();

    useEffect(() => {
        const tips = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

        setTip(tips[Math.floor(Math.random() * tips.length)]);
    }, [location.pathname])

    return (
        <div>
            <center><small>{tip}</small></center>
        </div>
    );
}