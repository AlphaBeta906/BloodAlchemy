import { useContext } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { Link } from "react-router-dom";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";

export default function Buy() {
    const { user } = useContext(UserContext);

    var output = [
        (
            <div>
                <h2>Showing 15 pages of elements:</h2>
            </div>
        ),
    ]

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `elements/`)).then((snapshot1) => {
        items = []

        for (let i = 0; i < 15; i++) {
            true_elem = ""
            while (true_elem === "" && items.includes(true_elem)) {
                var elem_dict = Object.keys(snapshot1.val())
                true_elem = elem_dict[Math.floor(Math.random()*Object.keys(snapshot1.val()).length)]
            }

            items.push(true_elem)

            output.push(
                <div>
                    *️⃣ <b>{true_elem}</b> - <small>(<Link to={"/info/" + true_elem}>i</Link> ● <Link to={"/buy/" + true_elem}>b</Link>)</small>
                </div>
            )
        }
    }).catch((error) => {
        output.push(error.toString());
    });
};