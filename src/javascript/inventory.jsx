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
            if (snapshot.val()[params.user.replace(/%20/g, " ")] !== undefined) {
                true_user = params.user.replace(/%20/g, " ")
            } else if (snapshot.val()[params.user.replace(/%20/g, " ")] === undefined && user !== "") {
                true_user = user
            } else if (true_user === null) {
                const think = didYouMean(params.user, Object.keys(snapshot.val()))

                setResult(
                    <div>
                        <center>
                            <p class="text-2xl">User {params.user} not found</p>

                            <p class="text-xl">Did you mean <Link to={"/inventory/" + think}>{think}</Link>?</p>
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
                    <p class="text-2xl">Inventory</p>
                    </center>
                    <p class="text-xl">User: {true_user}</p>
                    <p class="text-xl" style={{color: '#5856D6'}}>🗂 Inventory:</p><br />
                </div>
            )]

            snapshot1.forEach((element) => {
                output.push((
                    <div>
                        *️⃣ {element.key} <span style={{fontSize: 10}}>(x{element.val()})</span> <small>(<Link to={"/info/" + element.key}>Info</Link> ・ <Link to={"/buy/" + element.key}>Buy</Link> ・ <Link to={"/sell/" + element.key}>Sell</Link>)</small>
                    </div>
                ))
            });

            setResult(output)
        }).catch((error) => {
            setResult(
                <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                    <p class="font-bold">🛑 Error 🛑</p>
                    <p class="text-sm">{error.toString()}</p>
                </div>
            );
        });
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