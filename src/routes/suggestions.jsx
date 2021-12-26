import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { Link } from "react-router-dom";
import firebaseConfig from "./firebase";

export default function Suggestions() {
    const [output, setOutput] = useState("");

    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    get(ref(db, 'suggestions')).then((snapshot) => {
        var reactions = [(
            <div>
                <center>
                    <h1>Suggestions</h1>
                </center>
            </div>
        )]

        snapshot.forEach(snap => {
            if (snap.key !== "lol" && [0, 1].includes(snap.val()["votes"])) {
                var reaction = snap.key.split("=");
                var e1 = reaction[0].split("+")[0];
                var e2 = reaction[0].split("+")[1];
                var reaction_name = reaction[1];

                reactions.push(
                    <div>
                        - <Link to={'/info/' + e1}>{e1}</Link> + <Link to={'/info/' + e2}>{e2}</Link> = {reaction_name} ({snap.val().votes}) <Link to={'/suggestion/' + e1 + "+" + e2 + "=" + reaction_name}>Vote</Link>
                    </div>
                );
            }
        });

        if (reactions.length === 1) {
            reactions.push(
                <div>
                    <br /><br />
                    <center style={{fontSize: 50}}>
                        <h2>No suggestions yet!</h2>
                    </center>
                </div>
            );
        }

        setOutput(reactions);
    }).catch((error) => {
        console.error(error);
    });

    return output;
}
