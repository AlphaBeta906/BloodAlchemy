import { useState, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, get, ref, set } from "firebase/database";
import { useParams, Link } from "react-router-dom";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";

export default function Buy() {
    const param = useParams();
    const [result, setResult] = useState("...");
    const [price, setPrice] = useState(0);
    const [output, setOutput] = useState("");
    const { user } = useContext(UserContext);

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `elements/`)).then((snapshot1) => {
        setPrice(snapshot1.val()[param.elem]["generation"] * (snapshot1.val()[param.elem]["complexity"] * 2));

        const onSubmit = () => {
            if (user !== "") {
                get(ref(db, `users/${user}/watts`)).then((snapshot1) => {
                    if (snapshot1.val() >= price) {
                        set(ref(db, `users/${user}/watts`), snapshot1.val() - price);
                        get(ref(db, `users/${user}/inventory`)).then((snapshot2) => {
                            if (snapshot2.val()[param.elem] === undefined) {
                                set(ref(db, `users/${user}/inventory/${param.elem}`), 1);
                            } else {
                                set(ref(db, `users/${user}/inventory/${param.elem}`), snapshot2.val()[param.elem] + 1);
                            }
    
                            setResult("You bought " + param.elem);
                        }).catch((error) => {
                            setResult(error.toString());
                        });
                    } else {
                        setResult("Insufficient funds!");
                    }
                }).catch((error) => {
                    setResult(error.toString());
                });
            }
        };
    
        if (user !== "") {
            setOutput(
                <div>
                    <center>
                        <h1>Buy</h1>
                    </center>
                    <center>You wanna buy one {param.element}?</center>
                    <center>It costs {price} watts.</center>
    
                    <center>Dealer: {result}</center>
                    <button onClick={onSubmit}>Buy</button>

                    <center><Link to="/menu/">Back to menu</Link></center>
                </div>
            );
        } else {
            setOutput(
                <div>
                    <center>
                      <p style={{fontSize: 100}}>403</p>
                      <p style={{fontSize: 50}}>Forbidden. Sign in to enter the page.</p>
                    </center>
                </div>
            )
        };
    }).catch((error) => {
        setOutput(error.toString());
    });

    return output;
};