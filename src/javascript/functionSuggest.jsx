import { useForm } from "react-hook-form"
import { useState, useEffect, useContext } from "react"
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import firebaseConfig from "./firebase";
import UserContext from "./userContext";

export default function FunctionSuggest() {
    const { register, handleSubmit } = useForm();
    const { user } = useContext(UserContext);
    const [result, setResult] = useState("");
    const [seconds, setSeconds] = useState(0);

    const onSubmit = async (data) => {
        var app = initializeApp(firebaseConfig);
        var db = getDatabase(app);

        if (seconds !== 0) {
            setResult(`Please wait ${seconds} seconds`);
        } else if (data.mode === "" || data.elem === "" || data.reaction === "") {
            setResult("Please fill in all fields!");
        } else {
            get(ref(db, `reactions`)).then(snapshot1 => {
                if (snapshot1[`${data.mode}(${data.elem})`] !== undefined) {
                    setResult("This reaction already exists!");
                } else {
                    get(ref(db, `elements`)).then(snapshot => {
                        if (snapshot.val()[data.elem] === undefined) {
                            setResult("The element does not exist!");
                        } else {
                            set(ref(db, `suggestions/${data.mode}(${data.elem})=${data.reaction}`), { 
                                votes: 0,
                                creator: user
                            });

                            setResult("👍 Suggestion added!");
                        }
                    }).catch(error => {
                        setResult("Error: " + error.toString());
                    });
                }
            }).catch(error => {
                setResult("Error: " + error.toString());
            });
        }
    }

    useEffect(() => {
        if (seconds > 0) {
            setTimeout(() => setSeconds(seconds - 1), 1000);
        } else {
            setSeconds(0);
        }
    }, [seconds]);

    return (
        <div>
            <center>
                <p class="text-2xl">Suggest: Mode Function</p>
                <form onSubmit={handleSubmit(onSubmit)} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <p style={{textAlign: "center"}}>Mode:</p>
                    <select {...register("mode")} class="block appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <option value="Refine">Refine</option>
                        <option value="Ferment">Ferment</option>
                    </select><br />
                    <input {...register("elem")} placeholder="Element" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /><br />
                    <p style={{fontSize:25, fontWeight:"bold"}}>=</p>
                    <input {...register("reaction")} placeholder="Reaction" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    <input type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" /><br/><br/>
                    <p>{result}</p>
                </form>
            </center>
        </div>
    )
}