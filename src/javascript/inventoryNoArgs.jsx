import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import { randomInt } from "./random";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";

export default function InventoryNoArgs() {
    const [result, setResult] = useState("");
    const { user } = useContext(UserContext);

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `users/`)).then((snapshot) => {
        var true_user = null

        if (true_user === null) {
            if (user !== "") {
                setResult(
                    <Navigate to={"/inventory/" + user} />
                )
            } else if (true_user === null) {
                const user_dict = Object.keys(snapshot.val())
                true_user = user_dict[randomInt(user_dict.length)]

                setResult(
                    <Navigate to={"/inventory/" + true_user} />
                )
            }
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