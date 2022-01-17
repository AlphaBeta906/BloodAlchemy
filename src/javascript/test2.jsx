import { useContext } from "react";
import { useForm } from "react-hook-form";
import { randomInt } from "./random";
import UserContext from "./userContext";
import Error from "./error";

export default function Test2() {
    const { user } = useContext(UserContext);
    const { register, handleSubmit } = useForm();
    const x = [...Array(4).keys()].splice(2, 4 - 2);

    const onSubmit = (data) => {
        const inventory = {"Fire": 3};
        const reactions = {"Fire+Water+Earth+Air": "Element"};
    };

    if (["AlphaBeta906", "ItzCountryballs"].includes(user)) {
        return (
            <div>
                <center>
                    <p class="text-2xl">Test Page: 2</p><br />
                    
                    <form onSubmit={handleSubmit(onSubmit)} class="bg-white dark:bg-slate-400 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
                        <input {...register("e1")} placeholder="Element 1" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

                        {x.map((item) => {
                            return (
                                <div>
                                    <p style={{fontSize:25, fontWeight:"bold"}}>+</p>
                                    <input {...register("e" + item.toString())} placeholder={"Element " + item} class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                            )
                        })}<br />
                        <input type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" /><br/><br/>
                    </form>
                </center>
            </div>
        )
    } else {
        return (
            <Error status="404" />
        )
    }
}