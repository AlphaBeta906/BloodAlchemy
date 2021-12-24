import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC2OA4hzyK73YLd41F3IPRRuhVciy532xQ",
  authDomain: "elementals4.firebaseapp.com",
  databaseURL: "https://elementals4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "elementals4", 
  storageBucket: "elementals4.appspot.com",
  messagingSenderId: "493819791208",
  appId: "1:493819791208:web:00ecc6ec14821d1514f8dd",
};

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