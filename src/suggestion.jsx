import { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";
import firebaseConfig from "./firebase";
import UserContext from "./userContext";
import axios from "axios";
import Error from "./error";

export default function Suggestion() {
    let params = useParams();

    const { user } = useContext(UserContext);
    const [result, setResult] = useState("");
    const [output, setOutput] = useState("");
    const [seconds, setSeconds] = useState(0);

    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    function mix_hex(hex1, hex2) {
        // http://127.0.0.1:5000/color_mixing/FFA500-FFA500
        var promise = axios.get("http://127.0.0.1:5000/color_mixing/" + hex1 + "-" + hex2);

        var new_promise = promise.then((res) => res.data.combined_color);

        return new_promise;
    }

    const onSubmit = () => {
        if (seconds !== 0) {
            setResult(`Please wait ${seconds} seconds`);
            return;
        }

        setSeconds(5);
        
        get(ref(db, 'suggestions/')).then((snapshot1) => {
            if (snapshot1.val()[params.suggestion] !== undefined) {
                set(ref(db, 'suggestions/' + params.suggestion + '/votes'), snapshot1.val()[params.suggestion].votes + 1);

                if (snapshot1.val()[params.suggestion].votes === 1) {
                    const reaction = params.suggestion.split("=")[1];
                    set(ref(db, 'reactions/' + params.suggestion.split("=")[0]), reaction);

                    if (params.suggestion.includes("Refine(") || params.suggestion.includes("Ferment(")) {
                        const process = params.suggestion.split("=")[0].replace(")", "").split("(")[0];
                        const elem = params.suggestion.split("=")[0].replace(")", "").split("(")[1];

                        get(ref(db, 'elements/')).then((snapshot2) => {
                            if (snapshot2.val()[reaction] === undefined) {
                                var d = new Date();
                                var text = d.toUTCString();
                                var process_color = ""

                                switch (process) {
                                    case "Refine":
                                        process_color = "EEEEEE";
                                        break;
                                    default:
                                        process_color = "4F2956";
                                        break;
                                }

                                mix_hex(snapshot2.val()[elem].color, process_color).then((res) => {
                                    set(ref(db, 'elements/' + reaction), {
                                        "color": res,
                                        "generation": snapshot2.val()[elem]["generation"] + 1,
                                        "complexity": snapshot2.val()[elem]["complexity"] + 1,
                                        "date": text,
                                        "creator": snapshot1.val()[params.suggestion].creator
                                    });
                                });
                            }
                        }).catch((err) => {
                            setResult(err);
                        });
                    } else {
                        get(ref(db, 'elements/')).then((snapshot2) => {
                            var e1 = params.suggestion.split("=")[0].split("+")[0];
                            var e2 = params.suggestion.split("=")[0].split("+")[1];

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
                    }
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

    useEffect(() => {
        if (seconds > 0) {
            setTimeout(() => setSeconds(seconds - 1), 1000);
        } else {
            setSeconds(0);
        }
    }, [seconds]);

    get(ref(db, 'suggestions/')).then((snapshot) => {
        if (snapshot.val()[params.suggestion] === undefined || params.suggestion === "lol") {
            setOutput(
                <Error status="404" />
            );
        } else if (user === "") {
            setOutput(
                <Error status="401" />
            );
        } else {
            var status = "";

            if ([0, 1].includes(snapshot.val()[params.suggestion].vote)) {
                status = (
                    <div>
                        <center><h2>You want to vote?</h2></center>
                        <center><button onClick={onSubmit}>Vote</button></center>
                    </div>
                )
            } else {
                status = (
                    <div>
                        <center>
                            <h2 style={{color: "#ff3a30"}}>Vote has ended.</h2>
                        </center>
                    </div>
                )
            }
            setOutput(
                [
                    (<div>
                        <center>
                            <h2>Suggestion: {params.suggestion}</h2>
                        </center>

                        <p style={{color: "#6ac4dc"}}>🗳 Votes: {snapshot.val()[params.suggestion].votes}</p>
                        <p style={{color: "#8E8E93"}}>😀 Creator: <Link to={'/profile/' + snapshot.val()[params.suggestion].creator}>{snapshot.val()[params.suggestion].creator}</Link></p>
                    </div>),
                    status,
                    (<div>
                        <center>{result}</center>
                    </div>)
                ]
            );
        }
    }).catch((error) => {
        return (error.toString());        
    });

    return output;
}