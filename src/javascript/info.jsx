import { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import { didYouMean } from "./didYouMean";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";

export default function Info() {
    let params = useParams();

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    var valid = false

    const [result, setResult] = useState("");
    const { user } = useContext(UserContext);

    get(ref(db, `elements/`)).then((snapshot1) => {
        if (snapshot1.val()[params.element.replace("%20", " ")] !== undefined) {
            valid = true
        }

        var true_elem = null

        if (true_elem === null) {
            if (valid === true) {
                true_elem = params.element.replace("%20", " ")
            } else {
                const think = didYouMean(params.element.replace("%20", " "), Object.keys(snapshot1.val()))

                setResult(
                    <div>
                        <center>
                            <h1>Element {params.element.replace("%20", " ")} not found</h1>

                            <h2>Did you mean <Link to={"/info/" + think}>{think}</Link>?</h2>
                        </center>
                    </div>
                )

                return;
            }
        }

        get(ref(db, `users/`)).then((snapshot2) => {
            var price = snapshot1.val()[true_elem].generation * (snapshot1.val()[true_elem].complexity * 2)
            var result1 = ""

            if (user !== "") {
                if (snapshot2.val()[user]["inventory"][true_elem] === undefined) {
                    result1 = "🔐 You never had this element!"
                } else {
                    if (snapshot2.val()[user]["inventory"][true_elem] === 0) {
                        result1 = "🔒 You had this element before!"
                    } else {
                        result1 = "🔓 You have this element!"
                    }
                }
            } else {
                result1 = "🤮 You are not logged in!"
            }

            get(ref(db, 'wiki/')).then((snapshot3) => {
                var desc = ""
                var editor = ""

                if (snapshot3.val()[true_elem] !== undefined) {
                    desc = snapshot3.val()[true_elem]["content"]
                    editor = (<div><Link to={`/edit/${true_elem}`}>Edit</Link> - Last edit by: <Link to={"/profile/" + snapshot3.val()[true_elem]["last_editor"]}>{snapshot3.val()[true_elem]["last_editor"]}</Link></div>)
                } else {
                    desc = "No description available."
                    editor = (<div><Link to={`/edit/${true_elem}`}>Edit</Link></div>)
                }

                setResult(
                    <div>
                        <center><h1>Info</h1></center>
                        <h2 style={{color: `#${snapshot1.val()[true_elem].color}`}}>Element: {true_elem}</h2>
                        <p style={{color: "#ff3a30"}}>📆 Date of Creation: {snapshot1.val()[true_elem].date}</p>
                        <p style={{color: "#28CD41"}}>🟩 Generation: {snapshot1.val()[true_elem].generation}</p>
                        <p style={{color: "#FF9500"}}>🟧 Complexity: {snapshot1.val()[true_elem].complexity}</p>
                        <p style={{color: "#ffcc00"}}>⚡️ Price: {price} watts</p>
                        <p style={{color: "#8E8E93"}}>😀 Creator: <Link to={'/profile/' + snapshot1.val()[true_elem].creator}>{snapshot1.val()[true_elem].creator}</Link></p>

                        <center><h2>🤔 Description</h2></center>
                        <p>{desc}</p>
                        <small>{editor}</small><br /><br />

                        <p>{result1}</p>
                    </div>
                );
            }).catch((error) => {
                setResult(error.toString());
            });
        }).catch((error) => {
            setResult(error.toString());
        });
    }).catch((error) => {
        setResult(error.toString());
    });

    return result;
}