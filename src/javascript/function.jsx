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
            setResult(`Please wait ${seconds} seconds`);
        } else if (data.e1 === "" || data.e2 === "") {
            setResult("Please fill in both elements!");
        } else {
            get(ref(db, `users/${user}`)).then(snapshot2 => {
                if (snapshot2.val()["inventory"][data.elem] <= 0) {
                    setResult(
                        <>
                            The element <Link to={'/info/' + data.elem}>{data.elem}</Link> is not in your inventory! You can buy more <Link to={'/buy/' + data.elem}>here</Link>.
                        </>
                    );
                } else {
                    get(ref(db, 'reactions/')).then((snapshot) => {
                        if (snapshot.val()[`${data.mode}(${data.elem})`] === undefined) {
                            setResult(<>
                                No reaction ( {data.mode}({data.elem}) )<br />
                                <Link to='/suggestFunct'>Suggest?</Link>
                            </>);
                        } else {
                            setSeconds(5);

                            const e = `${data.mode}(${data.elem})`

                            get(ref(db, `elements/${snapshot.val()[e]}`)).then(snapshot1 => {
                                var watts = snapshot1.val().generation * snapshot1.val().complexity + gDTRGB(snapshot1.val().color) * snapshot2.val()["level"];
                                watts = Math.ceil(watts);

                                set(ref(db, `users/${user}/watts`), snapshot2.val()["watts"] + watts);

                                setResult(<>
                                    You got one <Link to={'/info/' + snapshot.val()[`${data.mode}(${data.elem})`]}>{snapshot.val()[`${data.mode}(${data.elem})`]}</Link>!<br />
                                    <span style={{ color: "#ffcc00" }}>⚡️ You got {watts} watts!</span>
                                </>)
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

                    <form onSubmit={handleSubmit(onSubmit)} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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