import { useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";
import firebaseConfig from "./firebase";
import UserContext from "./userContext";
import axios from "axios";

export default function Suggestion() {
    let params = useParams();

    const e1 = params.suggestion.split("=")[0].split("+")[0];
    const e2 = params.suggestion.split("=")[0].split("+")[1];
    const reaction = params.suggestion.split("=")[1];

    const { user } = useContext(UserContext);
    const [result, setResult] = useState("");
    const [output, setOutput] = useState("");

    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    function mix_hex(hex1, hex2) {
        // http://127.0.0.1:5000/color_mixing/FFA500-FFA500
        var promise = axios.get("http://127.0.0.1:5000/color_mixing/" + hex1 + "-" + hex2);

        var new_promise = promise.then((res) => res.data.combined_color);

        return new_promise;
    }

    const onSubmit = () => {
        get(ref(db, 'suggestions/')).then((snapshot1) => {
            if (snapshot1.val()[params.suggestion] !== undefined) {
                set(ref(db, 'suggestions/' + params.suggestion + '/votes'), snapshot1.val()[params.suggestion].votes + 1);

                if (snapshot1.val()[params.suggestion].votes === 1) {
                    set(ref(db, 'reactions/' + e1 + "+" + e2), reaction);

                    get(ref(db, 'elements/')).then((snapshot2) => {
                        if (snapshot2.val()[reaction] === undefined) {
                            var d = new Date();
                            let text = d.toUTCString();

                            var generation = 0

                            get(ref(db, 'elements/')).then((snapshot) => {
                                if (snapshot.val()[e1].generation < snapshot.val()[e2]["generation"]) {
                                    generation = snapshot.val()[e2]["generation"] + 1;
                                } else if (snapshot.val()[e1]["generation"] > snapshot.val()[e2]["generation"]) {
                                    generation = snapshot.val()[e1]["generation"] + 1;
                                } else if (snapshot.val()[e1]["generation"] === snapshot.val()[e2]["generation"]) {
                                    generation = snapshot.val()[e1]["generation"] + 1;
                                }

                                var complexity1 = 0
                                if (e1 === e2) {
                                    complexity1 = snapshot.val()[e1]["complexity"];
                                } else {
                                    if (snapshot.val()[e1]["complexity"] > snapshot.val()[e2]["complexity"]) {
                                        complexity1 = snapshot.val()[e1]["complexity"] + 1;
                                    } else if (snapshot.val()[e1]["complexity"] < snapshot.val()[e2]["complexity"]) {
                                        complexity1 = snapshot.val()[e2]["complexity"] + 1;
                                    } else if (snapshot.val()[e1]["complexity"] === snapshot.val()[e2]["complexity"]) {
                                        complexity1 = snapshot.val()[e1]["complexity"] + 1;
                                    }
                                }

                                mix_hex(snapshot.val()[e1]["color"], snapshot.val()[e2]["color"]).then((hex) => {
                                    var color = hex;

                                    set(ref(db, 'elements/' + reaction), {
                                        "color": color,
                                        "generation": generation,
                                        "complexity": complexity1,
                                        "date": text,
                                        "creator": snapshot1.val()[params.suggestion].creator
                                    });

                                    setResult(
                                        <>
                                            Added to database with new element: <Link to={'/info/' + reaction}>{reaction}</Link>
                                        </>
                                    )
                                }).catch((err) => {
                                    setResult(err.toString());
                                    return
                                });
                            }).catch((error) => {
                                setResult("Error: " + error.toString());
                            });
                        } else {
                            setResult("Added to database!");
                        }

                        get(ref(db, `users/${user}/inventory/${reaction}`)).then((snapshot) => {
                            set(ref(db, `users/${user}/inventory/${reaction}`), snapshot.val() + 1);
                        }).catch((error) => {
                            console.error(error);
                        });


                    }).catch((error) => {
                        console.error(error);
                    });
                } else {
                    setResult("Voted!");
                }
            } else {
                setResult("This reaction has not been suggested yet.");
            }
        }).catch((error) => {
            setResult(error.toString());
        });
    }

    get(ref(db, 'suggestions/')).then((snapshot) => {
        if (snapshot.val()[params.suggestion] === undefined || params.suggestion === "lol") {
            setOutput(
                <div>
                    <center>
                        <p style={{fontSize: 100}}>404</p>
                        <p style={{fontSize: 50}}>Page Not Found. That reaction is undefined</p>
                    </center>
                </div>
            );
        } else if (user === "") {
            setOutput(
                <div>
                    <center>
                        <p style={{fontSize: 100}}>403</p>
                        <p style={{fontSize: 50}}>Forbidden. You must be logged in to vote</p>
                    </center>
                </div>
            );
        } else if (![0, 1,].includes(snapshot.val()[params.suggestion].votes)) {
            setOutput(
                <div>
                    <center>
                        <h2>Suggestion: {e1} + {e2} = {reaction}</h2>
                    </center>

                    <p style={{color: "#6ac4dc"}}>🗳 Votes: 2</p>
                    <p style={{color: "#8E8E93"}}>😀 Creator: <Link to={'/profile/' + snapshot.val()[params.suggestion].creator}>{snapshot.val()[params.suggestion].creator}</Link></p>

                    <center><h2 style={{color: "#ff3a30"}}>Vote has ended.</h2></center>

                    <center>{result}</center>
                </div>
            );
        } else { 
            setOutput(
                <div>
                    <center>
                        <h2>Suggestion: {e1} + {e2} = {reaction}</h2>
                    </center>

                    <p style={{color: "#6ac4dc"}}>🗳 Votes: {snapshot.val()[params.suggestion].votes}</p>
                    <p style={{color: "#8E8E93"}}>😀 Creator: <Link to={'/profile/' + snapshot.val()[params.suggestion].creator}>{snapshot.val()[params.suggestion].creator}</Link></p>

                    <center><h2>You want to vote?</h2></center>
                    <center><button onClick={onSubmit}>Vote</button></center>

                    <center>{result}</center>
                </div>
            );
        }
    }).catch((error) => {
        return (error.toString());        
    });

    return output;
}