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
                    <p class="text-xl">User: {true_user}</p> <small><Link to={'/inventory/' + true_user}>(Check their inventory)</Link></small>
                    <p style={{color: "#55bff0"}}>🛠 Class: {snapshot1.val()[true_user].class}</p>
                    <p style={{color: "#ffcc00"}}>⚡️ Watts: {snapshot1.val()[true_user].watts}</p>
                    <p style={{color: "#ff3a30"}}>💡 Percentage of Elements Found: {percentage}%</p>

                    <div class="meter">
                        <span style={{width: `${percentage}%`}}><span></span></span>
                    </div>
                </div>
            );
        }).catch((error) => {
            setResult(error.toString());
        });
    }).catch((error) => {
        setResult(error.toString());
    });

    return result;
}