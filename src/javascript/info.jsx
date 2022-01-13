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
        if (snapshot1.val()[params.element.replace(/%20/g, " ")] !== undefined) {
            valid = true
        }

        var true_elem = null

        if (true_elem === null) {
            if (valid === true) {
                true_elem = params.element.replace(/%20/g, " ")
            } else {
                const think = didYouMean(params.element.replace(/%20/g, " "), Object.keys(snapshot1.val()))

                setResult(
                    <div>
                        <center>
                            <p class="text-2xl">Element {params.element.replace(/%20/g, " ")} not found</p>

                            <p class="text-xl">Did you mean <Link to={"/info/" + think}>{think}</Link>?</p>
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
                        <center><p class="text-2xl">Info</p></center>
                        <p class="text-xl" style={{color: `#${snapshot1.val()[true_elem].color}`}}>Element: {true_elem}</p><br />
                        <div class="relative pt-1">
                            <div class="flex mb-2 items-center justify-between">
                                <div>
                                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                                        📅 Date of Creation
                                    </span>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs font-semibold inline-block text-red-600">
                                        {snapshot1.val()[true_elem].date}
                                    </span>
                                </div>
                            </div>
                            <div class="flex mb-2 items-center justify-between">
                                <div>
                                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                        🟩 Generation
                                    </span>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs font-semibold inline-block text-green-600">
                                        {snapshot1.val()[true_elem].generation}
                                    </span>
                                </div>
                            </div>
                            <div class="flex mb-2 items-center justify-between">
                                <div>
                                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-200">
                                        🟧 Complexity
                                    </span>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs font-semibold inline-block text-orange-600">
                                        {snapshot1.val()[true_elem].complexity}
                                    </span>
                                </div>
                            </div>
                            <div class="flex mb-2 items-center justify-between">
                                <div>
                                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                                        ⚡️ Price
                                    </span>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs font-semibold inline-block text-yellow-600">
                                        {price}
                                    </span>
                                </div>
                            </div>
                            <div class="flex mb-2 items-center justify-between">
                                <div>
                                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                                        😀 Creator
                                    </span>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs font-semibold inline-block text-gray-600">
                                        <Link to={'/profile/' + snapshot1.val()[true_elem].creator}>{snapshot1.val()[true_elem].creator}</Link>
                                    </span>
                                </div>
                            </div>
                            <div class="flex mb-2 items-center justify-between">
                                <div>
                                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                        📖 Description
                                    </span>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs font-semibold inline-block text-blue-600">
                                        {desc}{editor}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="relative pt-1">
                            <div class="flex mb-2 items-center justify-between">
                                <div>
                                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                                        🗝 Status
                                    </span>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs font-semibold inline-block text-gray-600">
                                        {result1}
                                    </span>
                                </div>
                            </div>
                        </div>
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