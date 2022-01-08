import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { randomInt } from "./random";
import UserContext from "./userContext";

export default function Tips() {
    const [tip, setTip] = useState("");
    const { user, setUser } = useContext(UserContext);
    let location = useLocation();

    useEffect(() => {
        const tips = ["Stuck? Try randomly combining elements.", "Need more resources, mine it!", "In debt? Sell your elements!", "Need more watts? Upgrade your generators!", "You want to rise from slave to master? Invade a mine!"];

        setTip(tips[randomInt(tips.length)]);

        if (user === "") {
            if (window.localStorage.getItem("user") !== null) {
                setUser(window.localStorage.getItem("user"));
                console.log(window.localStorage.getItem("user"));
            }
        } else {
            window.localStorage.setItem("user", user);
        }
    }, [location.pathname, user, setUser]);

    return (
        <div>
            <center><small>Tip: {tip}</small></center>
        </div>
    );
}