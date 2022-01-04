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
                               setResult("Error: " + error.toString()); 
                            });

                            get(ref(db, `users/${user}/inventory/${data.elem}`)).then((snapshot3) => {
                                set(ref(db, `users/${user}/inventory/${data.elem}`), snapshot3.val() - 1);
                            }).catch((error) => {
                                setResult("Error: " + error.toString());
                            });

                            const a = snapshot.val()[`${data.mode}(${data.elem})`]

                            get(ref(db, `users/${user}/inventory/${a}`)).then((snapshot3) => {
                                set(ref(db, `users/${user}/inventory/${a}`), snapshot3.val() + 1);
                            }).catch((error) => {
                                setResult("Error: " + error.toString());
                            });
                        }
                    }).catch((error) => {
                        setResult(error.toString());
                    });
                }
            }).catch((error) => {
                setResult(error.toString());
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