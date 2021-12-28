import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
import UserContext from './userContext';
import firebaseConfig from './firebase';

export default function Attack() {
    const { register, handleSubmit } = useForm();
    const [result, setResult] = useState("");
    const [your_power, set_your_power] = useState(0);
    const [owner_power, set_owner_power] = useState(0);
    const { user } = useContext(UserContext);

    const onSubmit = (data) => {
        var app = initializeApp(firebaseConfig);
        var db = getDatabase(app);

        set_owner_power(0);
        set_your_power(0);

        get(ref(db, '/mines/')).then((snapshot1) => {
            if (snapshot1.val()[data.mine] === undefined) {
                setResult("Mine not found!");
            } else if (snapshot1.val()[data.mine].owner === user) {
                setResult("You own this mine!");
            } else {
                get(ref(db, 'users/')).then((snapshot2) => {
                    Object.keys(snapshot2.val()[user]["inventory"]).forEach((element) => {
                        get(ref(db, 'elements/')).then((snapshot3) => {
                            set_your_power((snapshot3.val()[element].generation * 2) * (snapshot3.val()[element].complexity * 3) + your_power);
                        }).catch((error) => {
                            setResult("Error" + error.toString());
                        });
                    });

                    Object.keys(snapshot2.val()[snapshot1.val()[data.mine].owner]["inventory"]).forEach((element) => {
                        get(ref(db, 'elements/')).then((snapshot3) => {
                            console.log(snapshot3.val()[element].generation * 2 * snapshot3.val()[element].complexity * 3);

                            set_owner_power((snapshot3.val()[element].generation * 2) * (snapshot3.val()[element].complexity * 3) + owner_power);
                        }).catch((error) => {
                            setResult("Error" + error.toString());
                        });
                    });

                    console.log(your_power);
                    console.log(owner_power);

                    if (your_power > owner_power) {
                        set(ref(db, 'mines/' + data.mine + '/owner'), user);
                        setResult("You won!");
                    } else if (owner_power > your_power) {
                        setResult("You lost!");
                    } else {
                        setResult("Draw!");
                    }
                }).catch((error) => {
                    setResult("Error" + error.toString());
                });
            }
        }).catch((error) => {
            setResult("Error: " + error.toString());
        });
    };

    if (user !== '') {
        return (
            <div>
                <center>
                    <h1>Attack</h1>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input {...register("mine")} placeholder='Mine' />

                        <input type="submit" />
                        <p>{result}</p>
                    </form>
                </center>
            </div>
        );
    } else {
        return (
            <div>
                <center>
                <div className="status" style={{fontSize:100}}>403</div><br />
                <div className="desk" style={{fontSize: 50}}>Forbidden. Sign in to enter the page.</div>
                </center>
            </div>
        )
    }
}