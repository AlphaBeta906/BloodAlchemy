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
                <h1>Suggest: Mode Function</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p style={{textAlign: "center"}}>Mode:</p>
                    <select {...register("mode")}>
                        <option value="Refine">Refine</option>
                        <option value="Ferment">Ferment</option>
                    </select><br />
                    <input {...register("elem")} placeholder="Element" /><br />
                    <p style={{fontSize:25, fontWeight:"bold"}}>=</p>
                    <input {...register("reaction")} placeholder="Reaction" />
                    <p>{result}</p>
                    <input type="submit" />
                </form>
            </center>
        </div>
    )
}