import { useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, get, set, ref } from 'firebase/database';
import { randomInt } from './random';
import firebaseConfig from './firebase';
import UserContext from './userContext';
import Error from './error';

export default function Search() {
    const [result, setResult] = useState("");
    const [seconds, setSeconds] = useState(0);
    const { user } = useContext(UserContext);

    const onSubmit = () => {
        var app = initializeApp(firebaseConfig);
        var db = getDatabase(app);

        if (seconds !== 0) {
            setResult(
                <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
                    <p class="font-bold">ℹ️ Info ℹ️</p>
                    <p class="text-sm">Please wait for {seconds} seconds.</p>
                </div>
            );
        } else {
            get(ref(db, 'users/' + user)).then((snapshot) => {
                if (snapshot.val().class === "slave") {
                    setResult(
                        <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
                            <p class="font-bold">⚠️ Warning ⚠️</p>
                            <p class="text-sm">You are a slave, How would you try to search for mines?</p>
                        </div>
                    );
                } else if (snapshot.val().watts < 50) {
                    setResult(
                        <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
                            <p class="font-bold">⚠️ Warning ⚠️</p>
                            <p class="text-sm">Insufficent funds.</p>
                        </div>
                    );
                } else if (randomInt(4) !== 0) {
                    set(ref(db, 'users/' + user + "/watts"), {
                        watts: snapshot.val().watts - 50
                    });
                    setSeconds(20);


                    setResult(
                        <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
                            <p class="font-bold">ℹ️ Info ℹ️</p>
                            <p class="text-sm">You didn't find anything.</p>
                        </div>
                    );
                } else {
                    set(ref(db, 'users/' + user + "/watts"), {
                        watts: snapshot.val().watts - 50
                    });

                    get(ref(db, 'mines/')).then((snapshot1) => {
                        var mines = Object.keys(snapshot1.val()).length;
          
                        set(ref(db, 'mines/Mine ' + (mines + 1).toString()), {
                          owner: user,
                          start: randomInt(3) + 1,
                        })

                        setSeconds(20);

                        setResult(
                            <div class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 w-64" role="alert">
                                <p class="font-bold">✅ Success ✅</p>
                                <p class="text-sm">You found a mine!</p>
                            </div>
                        );
                    }).catch(error => {
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
    }, [seconds])

    if (user !== "") {
        return (
            <div>
                <center>
                    <p class="text-2xl">Search</p>

                    <p>There is a 1 in 5 chance of this suceeding. There is a cooldown of 20 seconds and a 50 watt tax. Are you sure you want to do it?</p><br />
                    <center><button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={onSubmit}>Yes</button></center><br />
                    <p>{result}</p>
                </center>

                <footer>
                    <Ads/><br/>
                </footer>
            </div>
        )
    } else {
        return (
            <Error status="401" />
        )
    }
}