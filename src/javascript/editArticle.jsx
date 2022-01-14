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
            if (snapshot.val()[params.elem.replace(/%20/g, " ")] === undefined) {
                setResult(
                    <div class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 w-64" role="alert">
                        <p class="font-bold">✅ Success ✅</p>
                        <p class="text-sm">Article added.</p>
                    </div>
                );
            } else {
                setResult(
                    <div class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 w-64" role="alert">
                        <p class="font-bold">✅ Success ✅</p>
                        <p class="text-sm">Article edited.</p>
                    </div>
                );
            }

            set(ref(db, `wiki/${params.elem.replace(/%20/g, " ")}`), {
                content: data.text,
                last_editor: user
            })
        }).catch((error) => {
            setResult(
                <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                    <p class="font-bold">🛑 Error 🛑</p>
                    <p class="text-sm">{error.toString()}</p>
                </div>
            );
        });
    };

    useEffect(() => {
        var app = initializeApp(firebaseConfig);
        var db = getDatabase(app);

        get(ref(db, 'elements')).then((snapshot) => {
            if (snapshot.val()[params.elem.replace(/%20/g, " ")] !== undefined) {
                setExists(true);
            }
        }).catch((error) => {
            setResult(
                <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                    <p class="font-bold">🛑 Error 🛑</p>
                    <p class="text-sm">{error.toString()}</p>
                </div>
            );
        });
    }, [params.elem]);

    if (user !== "") {
        return (
            <div>
                <center>
                    <p class="text-2xl">Edit Article: {params.elem.replace(/%20/g, " ")}</p>

                    <form onSubmit={handleSubmit(onSubmit)} class="bg-white dark:bg-slate-400 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-fit">
                        <textarea {...register("text")} name="text" rows="10" cols="50" placeholder="Enter text here..." class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /><br />

                        <input type="submit" value="Submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
                    </form>

                    <p>{result}</p>

                    <Link to={`/info/${params.elem.replace(/%20/g, " ")}`}>Back to info page</Link>
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