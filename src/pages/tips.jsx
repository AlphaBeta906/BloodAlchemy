import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Tips() {
    const [tip, setTip] = useState("");
    let location = useLocation();

    useEffect(() => {
        const tips = ["Stuck? Try randomly combining elements.", "Need more resources, mine it!", "In debt? Sell your elements!", "Need more watts? Upgrade your generators!", "You want to rise from slave to master? Invade a mine!"];

        setTip(tips[Math.floor(Math.random() * tips.length)]);
    }, [location.pathname])

    return (
        <div>
            <center><small>Tip: {tip}</small></center>
        </div>
    );
}