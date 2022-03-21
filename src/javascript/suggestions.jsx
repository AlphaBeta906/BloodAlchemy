import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { Link } from "react-router-dom";
import firebaseConfig from "./firebase";
import Ads from './ads';

export default function Suggestions() {
    const [output, setOutput] = useState("");

    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    get(ref(db, 'suggestions')).then((snapshot) => {
        var reactions = [(
            <div>
                <center>
                    <p class="text-2xl">Suggestions</p>
                </center>
            </div>
        )]

        snapshot.forEach(snap => {
            if (snap.key !== "lol" && [0, 1].includes(snap.val()["votes"])) {
                if (snap.key.includes("Refine(") || snap.key.includes("Ferment(")) {
                    const reaction = snap.key.split("=")[1];
                    const process = snap.key.split("=")[0].replace(")", "").split("(")[0];
                    const elem = snap.key.split("=")[0].replace(")", "").split("(")[1];

                    reactions.push(
                        <div>
                            - {process}(<Link to={'/info/' + elem}>{elem}</Link>) = {reaction} ({snap.val().votes}) <Link to={'/suggestion/' + snap.key}>Vote</Link>
                        </div>
                    );
                } else {
                    var reaction2 = snap.key.split("=");
                    var e1 = reaction2[0].split("+")[0];
                    var e2 = reaction2[0].split("+")[1];
                    var reaction_name = reaction2[1];

                    reactions.push(
                        <div>
                            - <Link to={'/info/' + e1}>{e1}</Link> + <Link to={'/info/' + e2}>{e2}</Link> = {reaction_name} ({snap.val().votes}) <Link to={'/suggestion/' + snap.key}>Vote</Link>
                        </div>
                    );
                }
            }
        });

        if (reactions.length === 1) {
            reactions.push(
                <div>
                    <br /><br />
                    <center style={{fontSize: 50}}>
                        <p>No suggestions yet!</p>
                    </center>
                </div>
            );
        }

        reactions.push(
            <footer>
                <Ads/><br/>
            </footer>
        );

        setOutput(reactions);
    }).catch((error) => {
        console.error(error);
    });

    return output;
}
