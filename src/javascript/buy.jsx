import { useState, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, get, ref, set } from "firebase/database";
import { useParams, Link } from "react-router-dom";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";
import Error from "./error";

export default function Buy() {
    const param = useParams();
    const [result, setResult] = useState("...");
    const [output, setOutput] = useState("");
    const { user } = useContext(UserContext);

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `elements/`)).then((snapshot1) => {
        if (Object.keys(snapshot1.val()).includes(param.elem)) {
            const price = snapshot1.val()[param.elem]["generation"] * (snapshot1.val()[param.elem]["complexity"] * 2)

            const onSubmit = () => {
                if (user !== "") {
                    get(ref(db, `users/${user}/watts`)).then((snapshotx) => {
                        if (snapshotx.val() >= price) {
                            set(ref(db, `users/${user}/watts`), snapshotx.val() - price);
                            get(ref(db, `users/${user}/inventory`)).then((snapshot2) => {
                                if (snapshot2.val()[param.elem] === undefined) {
                                    set(ref(db, `users/${user}/inventory/${param.elem}`), 1);
                                } else {
                                    set(ref(db, `users/${user}/inventory/${param.elem}`), snapshot2.val()[param.elem] + 1);
                                }
        
                                setResult("You bought " + param.elem);
                            }).catch((error) => {
                                setResult(
                                    <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                                        <p class="font-bold">🛑 Error 🛑</p>
                                        <p class="text-sm">{error.toString()}</p>
                                    </div>
                                );;
                            });
                        } else {
                            setResult("Insufficient funds!");
                        }
                    }).catch((error) => {
                        setResult(
                                    <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                                        <p class="font-bold">🛑 Error 🛑</p>
                                        <p class="text-sm">{error.toString()}</p>
                                    </div>
                                );;
                    });
                }
            };
        
            if (user !== "") {
                setOutput(
                    <div>
                        <center>
                            <p class="text-2xl">Buy</p>
                        </center>
                        <center>You wanna buy one {param.element}?</center>
                        <center>It costs {price} watts.</center>

                        <center>Dealer: {result}</center>
                        <center><button onClick={onSubmit} class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Buy</button></center><br />

                        <center><Link to="/menu/">Back to menu</Link></center>
                    </div>
                );
            } else {
                setOutput(
                    <Error status="401" />
                )
            }
        } else {
            setOutput(
                <Error status="404" />
            )
        }
    }).catch((error) => {
        setOutput(error.toString());
    });

    return output;
}