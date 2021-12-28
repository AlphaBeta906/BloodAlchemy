import { useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, get, set, ref } from 'firebase/database';
import firebaseConfig from './firebase';
import UserContext from './userContext';

export default function Search() {
    const [result, setResult] = useState("");
    const [seconds, setSeconds] = useState(0);
    const { user } = useContext(UserContext);

    const onSubmit = () => {
        var app = initializeApp(firebaseConfig);
        var db = getDatabase(app);

        if (seconds !== 0) {
            setResult(`Please wait ${seconds} seconds`);
            return;
        } else {
            get(ref(db, 'users/' + user)).then((snapshot) => {
                if (snapshot.val().class === "slave") {
                    setResult("You're a slave, you can't search! LOL 😂");
                } else if (snapshot.val().watts < 50) {
                    setResult("You don't have enough watts to search!");
                } else if (Math.floor(Math.random() * 4) !== 0) {
                    set(ref(db, 'users/' + user + "/watts"), {
                        watts: snapshot.val().watts - 50
                    });
                    setSeconds(20);


                    setResult("You didn't find anything... I did'nt said I warned you.");
                } else {
                    set(ref(db, 'users/' + user + "/watts"), {
                        watts: snapshot.val().watts - 50
                    });

                    get(ref(db, 'mines/')).then(snapshot => {
                        var mines = Object.keys(snapshot.val()).length;
          
                        set(ref(db, 'mines/Mine ' + (mines + 1).toString()), {
                          owner: user,
                          start: Math.floor(Math.random() * 2) + 1,
                        })

                        setSeconds(20);

                        setResult("Against all odds, you found a mine!");
                    }).catch(error => {
                        setResult("Error: " + error.toString());
                    });
                }
            }).catch((error) => {
                setResult("Error: " + error.toString());
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

    return (
        <div>
            <center><h1>Search</h1></center>

            <p>There is a 1 in 5 chance of this suceeding. There is a cooldown of 20 seconds and a 50 watt tax. Are you sure you want to do it?</p>
            <center><button onClick={onSubmit}>Yes</button></center>

            <center><p>{result}</p></center>
        </div>
    )
}