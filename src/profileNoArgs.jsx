import { useState, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import { Navigate } from 'react-router-dom';
import UserContext from "./userContext";
import firebaseConfig from "./firebase";

export default function ProfileNoArgs() {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const [result, setResult] = useState("");
    const { user } = useContext(UserContext);

    get(ref(db, `users/`)).then((snapshot1) => {
        var true_user = ""

        if (user !== "") {
            setResult(
                <Navigate to={"/profile/" + user} />
            )
        } else if (true_user === "") {
            const user_dict = Object.keys(snapshot1.val())
            true_user = user_dict[Math.floor(Math.random()*Object.keys(snapshot1.val()).length)]

            setResult(
                <Navigate to={"/profile/" + true_user} />
            )
        }
    }).catch((error) => {
        setResult(error.toString());
    });

    return result;
}