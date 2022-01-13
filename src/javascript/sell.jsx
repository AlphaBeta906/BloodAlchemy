import { useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, get, ref, set } from "firebase/database";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";
import Error from "./error";

export default function Sell() {
    const param = useParams();

    const { user } = useContext(UserContext);
    const [result, setResult] = useState("");
    const [output, setOutput] = useState("");

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `elements/`)).then((snapshot1) => {
        if (Object.keys(snapshot1.val()).includes(param.elem)) {
            const price = snapshot1.val()[param.elem]["generation"] * (snapshot1.val()[param.elem]["complexity"] * 2)

            const onSubmit = () => {
                if (user !== "") {
                    get(ref(db, `users/${user}/inventory`)).then((snapshot2) => {
                        if (snapshot2.val()[param.elem] !== undefined && snapshot2.val()[param.elem] > 0) {
                            set(ref(db, `users/${user}/inventory/${param.elem}`), snapshot2.val()[param.elem] - 1);
                            get(ref(db, `users/${user}/watts`)).then((snapshot3) => {
                                set(ref(db, `users/${user}/watts`), snapshot3.val() + price);
        
                                setResult(
                                    <div class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 w-64" role="alert">
                                        <p class="font-bold">✅ Success ✅</p>
                                        <p class="text-sm">You have sold 1 {param.elem}.</p>
                                    </div>
                                );
                            }).catch((error) => {
                                setResult(
                                    <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                                        <p class="font-bold">🛑 Error 🛑</p>
                                        <p class="text-sm">{error.toString()}</p>
                                    </div>
                                );
                            });
                        } else {
                            setResult(
                                <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
                                    <p class="font-bold">⚠️ Warning ⚠️</p>
                                    <p class="text-sm">You do not have any {param.elem}!</p>
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
            };
        
            if (user !== "") {
                setOutput(
                    <div>
                        <center>
                            <p class="text-2xl">Sell</p><br />
                        </center>

                        <center>You wanna sell one {param.elem}?</center>
                        <center>You will get {price} watts!</center>

                        <center>Deal or No Deal?</center>

                        <center><button onClick={onSubmit} class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Deal</button></center><br />
                        <center><Link to="/menu/">Back to menu</Link></center>
                        <center>{result}</center>
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
            );
        }
    }).catch((error) => {
        setOutput(
            <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                <p class="font-bold">🛑 Error 🛑</p>
                <p class="text-sm">{error.toString()}</p>
            </div>
        );
    });

    return output;
}