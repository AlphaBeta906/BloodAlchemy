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
                    get(ref(db, `users/${user}/inventory`)).then((snapshot1) => {
                        if (snapshot1.val()[param.elem] !== undefined && snapshot1.val()[param.elem] > 0) {
                            set(ref(db, `users/${user}/inventory/${param.elem}`), snapshot1.val()[param.elem] - 1);
                            get(ref(db, `users/${user}/watts`)).then((snapshot2) => {
                                set(ref(db, `users/${user}/watts`), snapshot2.val() + price);
        
                                setResult("You bought " + param.elem);
                            }).catch((error) => {
                                setResult(error.toString());
                            });
                        } else {
                            setResult("You don't have any " + param.elem + "!");
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
                            <h1>Sell</h1>
                        </center>

                        <center>You wanna sell one {param.elem}?</center>
                        <center>You will get {price} watts!</center>

                        <center>Deal or No Deal?</center>

                        <center><button onClick={onSubmit}>Deal</button></center><br />
                        <center><Link to="/menu/">Back to menu</Link></center>
                        <center>{result}</center>
                    </div>
                );
            } else {
                setOutput(
                    <Error status="401" />
                )
            };
        } else {
            setOutput(
                <Error status="404" />
            );
        }
    }).catch((error) => {
        setOutput(error.toString());
    });

    return output;
}