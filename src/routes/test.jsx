import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import UserContext from "./userContext";
import axios from "axios";

export default function Test() {
    const { register, handleSubmit } = useForm();
    const { user } = useContext(UserContext);
    const [result, setResult] = useState("...");

    function mix_hex(hex1, hex2) {
        // http://127.0.0.1:5000/color_mixing/FFA500-FFA500
        var promise = axios.get("http://127.0.0.1:5000/color_mixing/" + hex1 + "-" + hex2);

        var new_promise = promise.then((res) => res.data.combined_color);

        return new_promise;
    }

    const onSubmit = (data) => {
        mix_hex(data.c1, data.c2).then((res) => {
            setResult(res);
        }).catch((err) => {
            setResult(err.toString());
        });
    }

    /*
    function output_combine_forms(n) {
        var output = [
            <>
                <center>
                <input placeholder="Element 1" />
                <p style={{ fontSize: 25 }}>+</p>
                <input placeholder="Element 2" />
                </center>
            </>
        ];
    
        for (var i = 1; i < n + 1; i++) {
            output.push(
                <>
                    <center>
                    <p style={{ fontSize: 25 }}>+</p>
                    <input placeholder={"Element " + (i + n)} />
                    </center>
                </>
            )
        }
    
        return output;
    }
    */

    if (["AlphaBeta906", "ItzCountryballs"].includes(user)) {
        return (
            <div>
                <center>
                    <h1>Test</h1>
                </center>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <center>
                        <input {...register("c1")} placeholder="Color 1" />
                        <p style={{ fontSize: 25 }}>+</p>
                        <input {...register("c2")} placeholder="Color 2" />
                        <p style={{ fontSize: 25 }}>=</p>
                        <p>{result}</p>
                        <input type="submit" />
                    </center>
                </form>
            </div>
        )
    } else {
        return (
            <div>
                <center>
                  <p style={{fontSize: 100}}>403</p>
                  <p style={{fontSize: 50}}>Forbidden. Also get out and shhhhh. <b>DO NOT TALK ABOUT THIS OR WE WILL BAN YOU</b> <sup>(idk if Itz will allow it...)</sup> - Alpha</p>
                </center>
            </div>
        )
    }
}