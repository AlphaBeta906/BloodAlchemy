import { useState } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { randomInt } from './random';
import firebaseConfig from "./firebase";

export default function Menu() {
    var [output, setOutput] = useState("");

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `elements/`)).then((snapshot1) => {
        if (output === "") {
            var menu = [(
                <div>
                    <center>
                        <p class="text-2xl">Menu</p>
                    </center>

                    <p>Showing 15 random elememnts...</p>
                </div>
            )]

            for (let i = 0; i < 15; i++) {
                var true_elem = ""

                var elem_dict = Object.keys(snapshot1.val())
                true_elem = elem_dict[randomInt(elem_dict.length)]
                menu.push(
                    <div>
                        *️⃣ <b>{true_elem}</b> - <small>(<Link to={"/info/" + true_elem}>i</Link> ・ <Link to={"/buy/" + true_elem}>b</Link> ・ <Link to={"/sell/" + true_elem}>s</Link>)</small>
                    </div>
                )
            }

            menu.push(
                <div>
                    <center><Link to="/menu/">Reload</Link></center>
                </div>
            )
            setOutput(menu);
        }
    }).catch((error) => {
        output.push(error.toString());
    });

    return output;
}