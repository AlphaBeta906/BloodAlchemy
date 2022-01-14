import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { initializeApp } from "firebase/app";
import { getDatabase, get, ref, set } from "firebase/database";
import { Link } from "react-router-dom";
import { gDTRGB } from "./colorDistance";
import firebaseConfig from "./firebase";
import UserContext from "./userContext";
import Error from "./error";

export default function Function() {
    const { handleSubmit, register } = useForm();
    const { user } = useContext(UserContext);
    const [result, setResult] = useState("");
    const [seconds, setSeconds] = useState(0);

    const onSubmit = (data) => {
        var app = initializeApp(firebaseConfig);
        var db = getDatabase(app);

        if (seconds !== 0) {
            setResult(
                <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
                    <p class="font-bold">ℹ️ Info ℹ️</p>
                    <p class="text-sm">Please wait {seconds} seconds.</p>
                </div>
            )
        } else if (data.e1 === "" || data.e2 === "") {
            setResult(
                <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
                    <p class="font-bold">⚠️ Warning ⚠️</p>
                    <p class="text-sm">Please fill in both elements!</p>
                </div>
            );
        } else {
            get(ref(db, `users/${user}`)).then(snapshot2 => {
                if (snapshot2.val()["inventory"][data.elem] <= 0) {
                    setResult(
                        <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
                            <p class="font-bold">⚠️ Warning ⚠️</p>
                            <p class="text-sm">The element <Link to={'/info/' + data.elen}>{data.elem}</Link> is not in your inventory! You can buy more <Link to={'/buy/' + data.elem}>here</Link></p>
                        </div>
                    );
                } else {
                    get(ref(db, 'reactions/')).then((snapshot) => {
                        if (snapshot.val()[`${data.mode}(${data.elem})`] === undefined) {
                            setResult(
                                <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
                                    <p class="font-bold">ℹ️ Info ℹ️</p>
                                    <p class="text-sm">No reaction ( {data.mode}({data.elem}) ) <Link to="/suggestFunct">Suggest?</Link>.</p>
                                </div>
                            );
                        } else {
                            setSeconds(5);

                            const e = `${data.mode}(${data.elem})`

                            get(ref(db, `elements/${snapshot.val()[e]}`)).then(snapshot1 => {
                                var watts = snapshot1.val().generation * snapshot1.val().complexity + gDTRGB(snapshot1.val().color) * snapshot2.val()["level"];
                                watts = Math.ceil(watts);

                                set(ref(db, `users/${user}/watts`), snapshot2.val()["watts"] + watts);

                                setResult(
                                    <div class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 w-64" role="alert">
                                        <p class="font-bold">✅ Success ✅</p>
                                        <p class="text-sm">You have created {snapshot.val()[e]}, which gives you {watts} watts!</p>
                                    </div>
                                )
                            }).catch(error => {
                               setResult(
                                    <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                                        <p class="font-bold">🛑 Error 🛑</p>
                                        <p class="text-sm">{error.toString()}</p>
                                    </div>
                                ); 
                            });

                            get(ref(db, `users/${user}/inventory/${data.elem}`)).then((snapshot3) => {
                                set(ref(db, `users/${user}/inventory/${data.elem}`), snapshot3.val() - 1);
                            }).catch((error) => {
                                setResult(
                                    <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                                        <p class="font-bold">🛑 Error 🛑</p>
                                        <p class="text-sm">{error.toString()}</p>
                                    </div>
                                );
                            });

                            const a = snapshot.val()[`${data.mode}(${data.elem})`]

                            get(ref(db, `users/${user}/inventory/${a}`)).then((snapshot3) => {
                                set(ref(db, `users/${user}/inventory/${a}`), snapshot3.val() + 1);
                            }).catch((error) => {
                                setResult(
                                    <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                                        <p class="font-bold">🛑 Error 🛑</p>
                                        <p class="text-sm">{error.toString()}</p>
                                    </div>
                                );
                            });
                        }
                    }).catch((error) => {
                        setResult(
                            <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                                <p class="font-bold">🛑 Error 🛑</p>
                                <p class="text-sm">{error.toString()}</p>
                            </div>
                        );
                    });
                }
            }).catch((error) => {
                setResult(
                    <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                        <p class="font-bold">🛑 Error 🛑</p>
                        <p class="text-sm">{error.toString()}</p>
                    </div>
                );
            });
        }
    };

    useEffect(() => {
        if (seconds > 0) {
            setTimeout(() => setSeconds(seconds - 1), 1000);
        } else {
            setSeconds(0);
        }
    }, [seconds]);

    if (user === "") {
        return (
            <>
                <Error status="401" />
            </>
        )
    } else {
        return (
            <div>
                <center>
                    <p class="text-2xl">Play: Function Mode</p>

                    <form onSubmit={handleSubmit(onSubmit)} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
                        <p style={{textAlign: "center"}}>Mode:</p>
                        <select {...register("mode")} class="block appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option value="Refine">Refine</option>
                            <option value="Ferment">Ferment</option>
                        </select><br />
                        <input {...register("elem")} placeholder="Element" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /><br /><br/>
                        <input type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" /><br/><br/>
                        <p>{result}</p>
                    </form>
                </center>
            </div>
        );
    }
}