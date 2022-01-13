import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import { randomInt } from './random';
import firebaseConfig from "./firebase";

export default function InfoNoArgs() {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const [result, setResult] = useState("");

    get(ref(db, `elements/`)).then((snapshot1) => {
        const elem_dict = Object.keys(snapshot1.val())
        var true_elem = elem_dict[randomInt(elem_dict.length)]

        setResult(
            <Navigate to={"/info/" + true_elem} />
        )
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