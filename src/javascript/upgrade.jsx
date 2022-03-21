import { useState, useContext, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";
import Error from "./error";

export default function Upgrade() {
    const [result, setResult] = useState("");
    const [seconds, setSeconds] = useState(0);
    const [level, setLevel] = useState(0);
    const { user } = useContext(UserContext);

    const onSubmit = () => {
        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);

        if (seconds !== 0) {
            setResult(
                <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
                    <p class="font-bold">ℹ️ Info ℹ️</p>
                    <p class="text-sm">Please wait {seconds} seconds.</p>
                </div>
            );
        } else {
            setSeconds(20);

            get(ref(db, "/users/")).then((snapshot) => {
                var cost = (!["AlphaBeta906", "ItzCountryballs", "Nv7", "oli"].includes(user)) ? (level + 1) * 100 : 0;

                if (snapshot.val()[user]["watts"] >= cost) {
                    set(ref(db, "/users/" + user + "/level"), level + 1);
                    set(ref(db, "/users/" + user + "/watts"), snapshot.val()[user]["watts"] - cost);

                    setResult(
                        <div class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 w-64" role="alert">
                            <p class="font-bold">✅ Success ✅</p>
                            <p class="text-sm">Upgrade sucessful!</p>
                        </div>
                    );
                } else {
                    setResult(
                        <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
                            <p class="font-bold">⚠️ Warning ⚠️</p>
                            <p class="text-sm">Insufficient funds.</p>
                        </div>
                    );
                }
            }).catch((error) => {
                setResult(
                    <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                        <p class="font-bold">🛑 Error 🛑</p>
                        <p class="text-sm">{error.toString()}</p>
                    </div>
                );
            });
        }
    }

    useEffect(() => {
        var app = initializeApp(firebaseConfig);
        var db = getDatabase(app);

        if (seconds > 0) {
            setTimeout(() => setSeconds(seconds - 1), 1000);
        } else {
            setSeconds(0);
        }

        get(ref(db, '/users/' + user)).then((snapshot) => {
            setLevel(snapshot.val().level);
        }).catch((error) => {
            setResult(
                <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                  <p class="font-bold">🛑 Error 🛑</p>
                  <p class="text-sm">{error.toString()}</p>
                </div>
            );
        });
    }, [seconds, user])

    if (user !== "") {
        return (
            <div>
                <center>
                    <p class="text-2xl">Upgrade</p>

                    <p>You would be upgrading from Level {level} to Level {level + 1}. Which will cost {(!["AlphaBeta906", "ItzCountryballs", "Nv7", "oli"].includes(user)) ? ((level * 1) * 100) : 0} watts.</p><br />

                    <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={onSubmit}>Upgrade</button>
                    <p>{result}</p>
                </center>

                <footer>
                    <Ads/><br/>
                </footer>
            </div>
        );
    } else {
        return (
            <Error status="401" desk="You are not logged in!" />
        )
    }
}