import { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import { didYouMean } from "./didYouMean";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";

export default function Profile() {
    let params = useParams();

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    var valid = false

    const [result, setResult] = useState("");
    const { user } = useContext(UserContext);

    get(ref(db, `users/`)).then((snapshot1) => {
        if (snapshot1.val()[params.user.replace(/%20/g, " ")] !== undefined) {
            valid = true
        }

        get(ref(db, `elements/`)).then((snapshot) => {
            var true_user = null

            if (true_user === null) {
                if (valid === true) {
                    true_user = params.user.replace(/%20/g, " ")
                } else if (valid === false && user !== "") {
                    true_user = user
                } else if (true_user === null) {
                    const think = didYouMean(params.user.replace(/%20/g, " "), Object.keys(snapshot1.val()))

                    setResult(
                        <div>
                            <center>
                                <p class="text-2xl">User {params.user.replace(/%20/g, " ")} not found</p>

                                <p class="text-xl">Did you mean <Link to={"/profile/" + think}>{think}</Link>?</p>
                            </center>
                        </div>
                    )

                    return;
                }
            }

            var len = Object.keys(snapshot.val()).length;
            var percentage = Math.floor(Object.keys(snapshot1.val()[true_user].inventory).length / len * 100);

            setResult(
                <div>
                    <center><p class="text-2xl">Profile</p></center>
                    <p class="text-xl">User: {true_user} {["AlphaBeta906", "ItzCountryballs"].includes(true_user) ? (<span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">⚙️ Admin</span>) : ""} {["Nv7"].includes(true_user) ? (<span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">🧪 Trusted BETA Tester</span>) : ""}</p> <small><Link to={'/inventory/' + true_user}>(Check their inventory)</Link></small><br /><br />

                    <div class="relative pt-1">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                🛠 Class
                            </span>
                            </div>
                            <div class="text-right">
                            <span class="text-xs font-semibold inline-block text-blue-600">
                                {snapshot1.val()[true_user].class}
                            </span>
                            </div>
                        </div>
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                                ⚡️ Watts
                            </span>
                            </div>
                            <div class="text-right">
                            <span class="text-xs font-semibold inline-block text-yellow-600">
                                {snapshot1.val()[true_user].watts}
                            </span>
                            </div>
                        </div>
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                                💡 Percentage of Elements
                            </span>
                            </div>
                            <div class="text-right">
                            <span class="text-xs font-semibold inline-block text-red-600">
                                {percentage}%
                            </span>
                            </div>
                        </div>
                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                            <div style={{width: `${percentage}%`}} class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                        </div>
                    </div>
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
    }).catch((error) => {
        setResult(
            <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                <p class="font-bold">🛑 Error 🛑</p>
                <p class="text-sm">{error.toString()}</p>
            </div>
        );
    });

    return result;
}