import { useContext, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
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

export default function Inventory() {
    let params = useParams();

    const [result, setResult] = useState("");
    const { user } = useContext(UserContext);

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `users/`)).then((snapshot) => {
        var true_user = null
        var bruh = ""

        if (bruh !== "ok") {
            if (snapshot.val()[params.user] !== undefined) {
                bruh = "ok"
                true_user = params.user
            } else if (snapshot.val()[params.user] === undefined && user !== "") {
                bruh = "ok"
                true_user = user
            } else if (true_user === null) {
                bruh = "ok"

                const user_dict = Object.keys(snapshot.val())
                true_user = user_dict[Math.floor(Math.random()*Object.keys(snapshot.val()).length)]

                setResult(
                    <Navigate to={"/inventory/" + true_user} />
                )
            }
        }
        
        get(ref(db, `users/${true_user}/inventory`)).then((snapshot1) => {
            var output = [(
                <div>
                    <center>
                    <h1>Inventory</h1>
                    </center>
                    <h2>User: {true_user}</h2>
                    <h2 style={{color: '#5856D6'}}>🗂 Inventory:</h2>
                </div>
            )]

            snapshot1.forEach((element) => {
                output.push((
                    <div>
                        *️⃣ <Link to={'/info/' + element.key}>{element.key}</Link> <span style={{fontSize: 10}}>(x{element.val()})</span>
                    </div>
                ))
            });

            setResult(output)
        }).catch((error) => {
            setResult(error.toString())
        });
    }).catch((error) => {
        setResult(error.toString())
    });

    return result;
}