import { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { initializeApp } from "firebase/app";
import { getDatabase, set, get, ref } from "firebase/database";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";
import Error from "./error";

export default function EditArticle() {
    const [result, setResult] = useState("");
    const [exists, setExists] = useState(false);
    const { register, handleSubmit } = useForm();
    const { user } = useContext(UserContext);
    let params = useParams();

    const onSubmit = (data) => {
        var app = initializeApp(firebaseConfig);
        var db = getDatabase(app);

        get(ref(db, `wiki`)).then((snapshot) => {
            if (snapshot.val()[params.elem] === undefined) {
                setResult("Article added!");
            } else {
                setResult("Article edited!");
            }

            set(ref(db, `wiki/${params.elem}`), {
                content: data.text,
                last_editor: user
            })
        }).catch((error) => {
            setResult(error.toString());
        });
    };

    useEffect(() => {
        var app = initializeApp(firebaseConfig);
        var db = getDatabase(app);

        get(ref(db, 'elements')).then((snapshot) => {
            if (snapshot.val()[params.elem] !== undefined) {
                setExists(true);
            }
        }).catch((error) => {
            setResult(error.toString());
        });
    }, [params.elem]);

    if (user !== "") {
        return (
            <div>
                <center>
                    <h1>Edit Article: {params.elem}</h1>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <textarea {...register("text")} name="text" rows="10" cols="50" placeholder="Enter text here..." /><br />

                        <input type="submit" value="Submit" />
                    </form>

                    <p>{result}</p>

                    <Link to={`/info/${params.elem}`}>Back to info page</Link>
                </center>
            </div>
        );
    } else if (!exists) {
        return (
            <Error status="404" />
        );
    } else {
        return (
            <Error status="401" />
        );
    }
}