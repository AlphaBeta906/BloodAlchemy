import { useState, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import { Navigate } from 'react-router-dom';
import { randomInt } from './random';
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
            true_user = user_dict[randomInt(user_dict.length)]

            setResult(
                <Navigate to={"/profile/" + true_user} />
            )
        }
    }).catch((error) => {
        setResult(
            <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                <p class="font-bold">🛑 Error 🛑</p>
                <p class="text-sm">{error.toString()}</p>
            </div>
        );
    });

    return result;
}