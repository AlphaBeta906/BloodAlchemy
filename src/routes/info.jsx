import { useState, useContext } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import UserContext from "./userContext";

const firebaseConfig = {
  apiKey: "AIzaSyC2OA4hzyK73YLd41F3IPRRuhVciy532xQ",
  authDomain: "elementals4.firebaseapp.com",
  databaseURL: "https://elementals4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "elementals4", 
  storageBucket: "elementals4.appspot.com",
  messagingSenderId: "493819791208",
  appId: "1:493819791208:web:00ecc6ec14821d1514f8dd",
};

export default function Info() {
    let params = useParams();

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    var valid = false

    const [result, setResult] = useState("");
    const { user } = useContext(UserContext);

    get(ref(db, `elements/`)).then((snapshot1) => {
        if (snapshot1.val()[params.element] !== undefined) {
            valid = true
        }

        var true_elem = null
        var bruh = ""

        if (bruh !== "ok") {
            if (valid === true) {
                bruh = "ok"
                true_elem = params.element
            } else if (valid === false && user !== "") {
                bruh = "ok"
                true_elem = user
            } else {
                bruh = "ok"

                const elem_dict = Object.keys(snapshot1.val())
                true_elem = elem_dict[Math.floor(Math.random()*Object.keys(snapshot1.val()).length)]

                setResult(
                    <Navigate to={"/info/" + true_elem} />
                )
            }
        }

        if (user === "") {
            setResult(
                <div>
                    <center><h1>Info</h1></center>
                    <h2 style={{color: `#${snapshot1.val()[true_elem].color}`}}>Element: {true_elem}</h2>
                    <p style={{color: "#ff3a30"}}>📆 Date of Creation: {snapshot1.val()[true_elem].date}</p>
                    <p style={{color: "#28CD41"}}>🟩 Generation: {snapshot1.val()[true_elem].generation}</p>
                    <p style={{color: "#FF9500"}}>🟧 Complexity: {snapshot1.val()[true_elem].complexity}</p>
                    <p style={{color: "#8E8E93"}}>😀 Creator: <Link to={'/profile/' + snapshot1.val()[true_elem].creator}>{snapshot1.val()[true_elem].creator}</Link></p>
                </div>
            );
        } else {
            get(ref(db, `users/${user}/inventory`)).then((snapshot2) => {
                var result1 = ""

                if (snapshot2.val()[true_elem] === undefined) {
                    result1 = "🔐 You never had this element!"
                } else {
                    if (snapshot2.val()[true_elem] === 0) {
                        result1 = "🔒 You had this element before!"
                    } else {
                        result1 = "🔓 You have this element!"
                    }
                }

                setResult(
                    <div>
                        <center><h1>Info</h1></center>
                        <h2 style={{color: `#${snapshot1.val()[true_elem].color}`}}>Element: {true_elem}</h2>
                        <p style={{color: "#ff3a30"}}>📆 Date of Creation: {snapshot1.val()[true_elem].date}</p>
                        <p style={{color: "#28CD41"}}>🟩 Generation: {snapshot1.val()[true_elem].generation}</p>
                        <p style={{color: "#FF9500"}}>🟧 Complexity: {snapshot1.val()[true_elem].complexity}</p>
                        <p style={{color: "#8E8E93"}}>😀 Creator: <Link to={'/profile/' + snapshot1.val()[true_elem].creator}>{snapshot1.val()[true_elem].creator}</Link></p><br/>
    
                        <p>{result1}</p>
                    </div>
                );
            }).catch((error) => {
                setResult(error.toString());
            });
        }
    }).catch((error) => {
        setResult(error.toString());
    });

    return result;
}