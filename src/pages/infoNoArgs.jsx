import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import firebaseConfig from "./services/firebase";

export default function InfoNoArgs() {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const [result, setResult] = useState("");

    get(ref(db, `elements/`)).then((snapshot1) => {
        const elem_dict = Object.keys(snapshot1.val())
        var true_elem = elem_dict[Math.floor(Math.random()*Object.keys(snapshot1.val()).length)]

        setResult(
            <Navigate to={"/info/" + true_elem} />
        )
    }).catch((error) => {
        setResult(error.toString());
    });

    return result;
}