import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import { randomInt } from "./random";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";

export default function Inventory() {
    const [result, setResult] = useState("");
    const { user } = useContext(UserContext);

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `users/`)).then((snapshot) => {
        var true_user = null
        var bruh = ""

        if (bruh !== "ok") {
            if (user !== "") {
                setResult(
                    <Navigate to={"/inventory/" + user} />
                )
            } else if (true_user === null) {
                bruh = "ok"

                const user_dict = Object.keys(snapshot.val())
                true_user = user_dict[randomInt(user_dict.length)]

                setResult(
                    <Navigate to={"/inventory/" + true_user} />
                )
            }
        }
    }).catch((error) => {
        setResult(error.toString())
    });

    return result;
}