import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";

export default function Inventory() {
    const [result, setResult] = useState("");
    const { user } = useContext(UserContext);

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `users/`)).then((snapshot) => {
        var true_user = null
        var bruh = ""

        if (bruh !== "ok") {
            if (user !== "") {
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