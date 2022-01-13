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
            setResult(`Please wait ${seconds} seconds`);
        } else {
            setSeconds(20);

            get(ref(db, "/users/")).then((snapshot) => {
                var cost = (level + 1) * 100;

                if (snapshot.val()[user]["watts"] >= cost) {
                    set(ref(db, "/users/" + user + "/level"), level + 1);
                    set(ref(db, "/users/" + user + "/watts"), snapshot.val()[user]["watts"] - cost);

                    setResult("Upgrade successful!");
                } else {
                    setResult("Not enough watts!");
                }
            }).catch((error) => {
                setResult("Error: " + error.toString());
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
            setResult("Error: " + error.toString());
        });
    }, [seconds, user])

    if (user !== "") {
        return (
            <div>
                <center>
                    <p class="text-2xl">Upgrade</p>

                    <p>You would be upgrading from Level {level} to Level {level + 1}. Which will cost {(level + 1) * 100} watts</p>

                    <button onClick={onSubmit}>Upgrade</button>
                    <p>{result}</p>
                </center>
            </div>
        );
    } else {
        return (
            <Error status="401" desk="You are not logged in!" />
        )
    }
}