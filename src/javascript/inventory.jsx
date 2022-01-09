import { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import { didYouMean } from "./didYouMean";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";

export default function Inventory() {
    let params = useParams();

    const [result, setResult] = useState("");
    const { user } = useContext(UserContext);

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `users/`)).then((snapshot) => {
        var true_user = null

        if (true_user === null) {
            if (snapshot.val()[params.user] !== undefined) {
                true_user = params.user
            } else if (snapshot.val()[params.user] === undefined && user !== "") {
                true_user = user
            } else if (true_user === null) {
                const think = didYouMean(params.user, Object.keys(snapshot.val()))

                setResult(
                    <div>
                        <center>
                            <h1>User {params.user} not found</h1>

                            <h2>Did you mean <Link to={"/inventory/" + think}>{think}</Link>?</h2>
                        </center>
                    </div>
                )

                return;
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
                        *️⃣ <Link to={'/info/' + element.key}>{element.key}</Link> <span style={{fontSize: 10}}>(x{element.val()})</span> <small>(<Link to={"/info/" + element.key}>Info</Link> ● <Link to={"/buy/" + element.key}>Buy</Link> ● <Link to={"/sell/" + element.key}>Sell</Link>)</small>
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