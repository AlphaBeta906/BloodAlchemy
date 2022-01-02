import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { initializeApp } from "firebase/app";
import { getDatabase, get, ref } from "firebase/database";
import { Link } from "react-router-dom";
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

        if (data.e1 === "" || data.e2 === "") {
            setResult("Please fill in both elements!");
        } else {
            get(ref(db, `users/${user}/inventory`)).then(snapshot => {
                if (snapshot.val()[data.elem] <= 0) {
                    setResult(
                        <>
                            The element <Link to={'/info/' + data.elem}>{data.elem}</Link> is not in your inventory! You can buy more <Link to={'/buy/' + data.elem}>here</Link>.
                        </>
                    );
                } else {
                    get(ref(db, 'reactions/')).then((snapshot) => {
                        if (snapshot[`${data.mode}(${data.elem})`] === undefined) {
                            setResult(<>
                                No reaction ( {data.mode}({data.elem}) )<br />
                                <Link to='/suggestFunct'>Suggest?</Link>
                            </>);
                        } else {
                            setSeconds(5);
                            setResult(snapshot[`${data.mode}(${data.elem})`]);
                        }
                    }).catch((error) => {
                        setResult(error);
                    });
                }
            }).catch((error) => {
                setResult(error);
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
                    <h1>Play: Function Mode</h1>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <p style={{textAlign: "center"}}>Mode:</p>
                        <select {...register("mode")}>
                            <option value="Refine">Refine</option>
                            <option value="Ferment">Ferment</option>
                        </select><br />
                        <input {...register("elem")} placeholder="Element" /><br />

                        <input type="submit" />
                        <p>{result}</p>
                    </form>
                </center>
            </div>
        );
    }
}