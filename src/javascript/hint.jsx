import { useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { didYouMean } from "./didYouMean";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";
import Error from "./error";
import Ads from './ads';

export default function Hint() {
    let { elem } = useParams();
    const { user } = useContext(UserContext);

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const [output, setOutput] = useState("");
    const [true_elem, setTrue_elem] = useState("");

    if (user !== "") {
        get(ref(db, `elements/`)).then((snapshot1) => {
            if (snapshot1.val()[elem.replace(/%20/g, " ")] !== undefined) {
                setTrue_elem(elem.replace(/%20/g, " "));
            } else {
                const think = didYouMean(elem.replace(/%20/g, " "), Object.keys(snapshot1.val()))

                setOutput(
                    <div>
                        <center>
                            <p class="text-2xl">Element {elem.replace(/%20/g, " ")} not found</p>

                            <p class="text-xl">Did you mean <Link to={"/info/" + think}>{think}</Link>?</p>
                        </center>
                    </div>
                )

                return;
            }

            get(ref(db, `users/${user}/inventory`)).then((snapshot2) => {
                get(ref(db, `reactions/`)).then((snapshot3) => {
                    var deOutput = [
                        (
                            <div>
                                <center>
                                    <p class="text-2xl">Hint(s) for {true_elem}:</p>
                                </center>
                            </div>
                        )
                    ]

                    snapshot3.forEach((reaction) => {
                        if (reaction.val() === true_elem) {
                            if (reaction.key.includes("Refine(") || reaction.key.includes("Ferment(")) {
                                const process = reaction.key.replace(")", "").split("(")[0];
                                const element = reaction.key.replace(")", "").split("(")[1];

                                if (snapshot2.val()[element] !== undefined && snapshot2.val()[element] !== 0) {
                                    deOutput.push(
                                        <div>
                                            - {process}({"#".repeat(element.length)}) = {elem} ✅
                                        </div>
                                    )
                                } else {
                                    deOutput.push(
                                        <div>
                                            - {process}({element.length * "-"}) = {elem} ❌
                                        </div>
                                    )
                                }
                            } else {
                                const e1 = reaction.key.split("+")[0];
                                const e2 = reaction.key.split("+")[1];

                                const rtxt = [e1, ("#".repeat(e2.length))].join("+")

                                if (snapshot2.val()[reaction] !== undefined && snapshot2.val()[reaction] !== 0) {
                                    deOutput.push(
                                        <div>
                                            - {rtxt} = {true_elem} ✅
                                        </div>
                                    )
                                } else {
                                    deOutput.push(
                                        <div>
                                            - {rtxt} = {true_elem} ❌
                                        </div>
                                    )
                                }
                            }
                        }
                    })

                    deOutput.push(<footer>
                        <Ads/><br/>
                    </footer>)

                    setOutput(deOutput);
                }).catch((error) => {
                    setOutput(
                        <div>
                            <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                                <p class="font-bold">🛑 Error 🛑</p>
                                <p class="text-sm">{error.toString()}</p>
                            </div>
                        </div>
                    )
                })
            }).catch((error) => {
                setOutput(
                    <div>
                        <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                            <p class="font-bold">🛑 Error 🛑</p>
                            <p class="text-sm">{error.toString()}</p>
                        </div>
                    </div>
                )
            });
        }).catch((error) => {
            setOutput(
                <div>
                    <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                        <p class="font-bold">🛑 Error 🛑</p>
                        <p class="text-sm">{error.toString()}</p>
                    </div>
                </div>
            )
        })

        return output;
    } else {
        return (
            <Error status="401" />
        )
    }
}