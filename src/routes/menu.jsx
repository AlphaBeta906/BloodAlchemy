import { useState } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from "firebase/app";
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

export default function Menu() {
    var [output, setOutput] = useState("");

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `elements/`)).then((snapshot1) => {
        for (let i = 0; i < 15; i++) {
            var menu = [(
                <div>
                    <center>
                        <h1>Menu</h1>
                    </center>
    
                    <p>Showing 15 random elememnts...</p>
                </div>
            )]
            
            var true_elem = ""

            var elem_dict = Object.keys(snapshot1.val())
            true_elem = elem_dict[Math.floor(Math.random()*Object.keys(snapshot1.val()).length)]
            menu.push(
                <div>
                    *️⃣ <b>{true_elem}</b> - <small>(<Link to={"/info/" + true_elem}>i</Link> ● <Link to={"/buy/" + true_elem}>b</Link>)</small>
                </div>
            )
        }

        setOutput(menu);
    }).catch((error) => {
        output.push(error.toString());
    });

    return output;
};