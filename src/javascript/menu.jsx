import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import firebaseConfig from "./firebase";

export default function Menu() {
    const [output, setOutput] = useState("");
    const { index } = useParams();

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    get(ref(db, `elements/`)).then((snapshot1) => {
        if (output === "") {
            var menu = [(
                <div>
                    <center>
                        <p class="text-2xl">Menu</p>
                    </center>

                    <p>Showing page {index}...</p>
                </div>
            )]

            const max_index = (Object.keys(snapshot1.val()).length / 25) + 1;

            if (index > max_index) {
                index = max_index;
            }
            
            const newIndex = index - 1;
            const elements = Object.keys(snapshot1.val());

            try {
                var elements2 = elements.slice(newIndex*25, newIndex*25+25);

                console.log(elements2);

                for (let elem in elements2) {
                    menu.push(
                        <div>
                            *️⃣ <Link to={"/info/" + elements2[elem]}>{elements2[elem]}</Link><br />
                        </div>
                    )
                }
            } catch (Exception) {
                setOutput(
                    <Navigate to="/menu/1" />
                )
            } finally {
                setOutput(menu);
            }
        }
    }).catch((error) => {
        setOutput(
            <Navigate to="/menu/1" />
        )
    });

    return output;
}