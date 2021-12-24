import { useState, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import { Navigate } from 'react-router-dom';
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

export default function ProfileNoArgs() {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const [result, setResult] = useState("");
    const { user } = useContext(UserContext);

    get(ref(db, `users/`)).then((snapshot1) => {
        var true_user = ""

        if (user !== "") {
            true_user = user
        } else if (true_user === "") {
            const user_dict = Object.keys(snapshot1.val())
            true_user = user_dict[Math.floor(Math.random()*Object.keys(snapshot1.val()).length)]

            setResult(
                <Navigate to={"/profile/" + true_user} />
            )
        }

        get(ref(db, `elements`)).then((snapshot) => {
            var len = Object.keys(snapshot.val()).length;
            var percentage = Math.floor(Object.keys(snapshot1.val()[true_user].inventory).length / len * 100);

            setResult(
                <div>
                    <center><h1>Profile</h1></center>
                    <h2>User: {true_user}</h2>
                    <p style={{color: "#55bff0"}}>🛠 Class: {snapshot1.val()[true_user].class}</p>
                    <p style={{color: "#ffcc00"}}>⚡️ Watts: {snapshot1.val()[true_user].watts}</p>
                    <p style={{color: "#ff3a30"}}>💡 Percentage of Elements Found: {percentage}%</p>

                    <div class="meter">
                        <span style={{width: `${percentage}%`}}><span></span></span>
                    </div>
                </div>
            );
        }).catch((error) => {
            setResult(error.toString());
        });
    }).catch((error) => {
        setResult(error.toString());
    });

    return result;
}