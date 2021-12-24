import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get } from "firebase/database";
import { Link } from "react-router-dom";
import UserContext from "./userContext";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyC2OA4hzyK73YLd41F3IPRRuhVciy532xQ",
  authDomain: "elementals4.firebaseapp.com",
  databaseURL: "https://elementals4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "elementals4", 
  storageBucket: "elementals4.appspot.com",
  messagingSenderId: "493819791208",
  appId: "1:493819791208:web:00ecc6ec14821d1514f8dd",
};

export default function Suggest() {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const { user } = useContext(UserContext);

  function mix_hex(hex1, hex2) {
    const promise = axios.get(`http://localhost:5000/color_mixing/${hex1}-${hex2}`);

    promise.then((res) => res.data.combined_color);

    return promise;
  }

  const onSubmit = async (data) => {
    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    var reactions = ref(db, 'reactions');
    onValue(reactions, (snapshot) => {
      var reactions = {};
      var elements = ["Fire", "Water", "Earth", "Air"];

      snapshot.forEach(snap => {
        reactions[snap.key] = snap.val();
        
        if (!elements.includes(snap.val())) {
          elements.push(snap.val());
        }
      });

      if (data.reaction === "") {
        setResult("It is... empty?");
      } else if (data.e1 === "" && data.e2 === "") {
        setResult("Please fill in both elements!");
      } else if (!(elements.includes(data.e1)) || !(elements.includes(data.e2))) {
        setResult("Please fill in a valid element!");
      } else if (reactions[data.e1 + "+" + data.e2] !== undefined || reactions[data.e2 + "+" + data.e1] !== undefined) {
        setResult("Reaction exists!");
      } else {
        get(ref(db, 'users/' + user + '/inventory')).then((snapshot) => {
          if (snapshot.val()[data.e1] < 0 || snapshot.val()[data.e1] === undefined) {
            setResult(
              <>
                The element <Link to={'/info/' + data.e1}>{data.e1}</Link> is not in your inventory!
              </>
            );
          } else if (snapshot.val()[data.e2] < 0 || snapshot.val()[data.e2] === undefined) {
            setResult(
              <>
                The element <Link to={'/info/' + data.e2}>{data.e2}</Link> is not in your inventory!
              </>
            );
          } else {
            set(ref(db, 'reactions/' + data.e1 + "+" + data.e2), data.reaction);

            if (!elements.includes(data.reaction)) {
              var d = new Date();
              let text = d.toUTCString();

              var generation = 0

              get(ref(db, 'elements/')).then((snapshot) => {
                if (snapshot.val()[data.e1].generation < snapshot.val()[data.e2]["generation"]) {
                    generation = snapshot.val()[data.e2]["generation"] + 1;
                } else if (snapshot.val()[data.e1]["generation"] > snapshot.val()[data.e2]["generation"]) {
                    generation = snapshot.val()[data.e1]["generation"] + 1;
                } else if (snapshot.val()[data.e1]["generation"] === snapshot.val()[data.e2]["generation"]) {
                    generation = snapshot.val()[data.e1]["generation"] + 1;
                }

                var complexity1 = 0
                if (data.e1 === data.e2) {
                    complexity1 = snapshot.val()[data.e1]["complexity"];
                } else {
                    if (snapshot.val()[data.e1]["complexity"] > snapshot.val()[data.e2]["complexity"]) {
                        complexity1 = snapshot.val()[data.e1]["complexity"] + 1;
                    } else if (snapshot.val()[data.e1]["complexity"] < snapshot.val()[data.e2]["complexity"]) {
                        complexity1 = snapshot.val()[data.e2]["complexity"] + 1;
                    } else if (snapshot.val()[data.e1]["complexity"] === snapshot.val()[data.e2]["complexity"]) {
                        complexity1 = snapshot.val()[data.e1]["complexity"] + 1;
                    }
                }
              
                var color = "";

                mix_hex(snapshot.val()[data.e1]["color"], snapshot.val()[data.e2]["color"]).then((hex) => {
                  color = hex;
                }).catch((err) => {
                  setResult(err.toString());
                  return
                });

                set(ref(db, 'elements/' + data.reaction), {
                  "color": color,
                  "generation": generation,
                  "complexity": complexity1,
                  "date": text,
                  "creator": user,
                });

                setResult(
                  <>
                    Added to database with new element: <Link to={'/info/' + data.reaction}>{data.reaction}</Link>
                  </>
                )
              }).catch((error) => {
                setResult("Error: " + error.toString());
              });

              elements.push(data.reaction);
              reactions[data.e1 + "+" + data.e2] = data.reaction;
            } else {
              setResult("Added to database!");
              reactions[data.e1 + "+" + data.e2] = data.reaction;
            }

            get(ref(db, `users/${user}/inventory/${data.e1}`)).then((snapshot) => {
              set(ref(db, `users/${user}/inventory/${data.e1}`), snapshot.val() - 1);
            }).catch((error) => {
              console.error(error);
            });

            get(ref(db, `users/${user}/inventory/${data.e2}`)).then((snapshot) => {
              set(ref(db, `users/${user}/inventory/${data.e2}`), snapshot.val() - 1);
            }).catch((error) => {
              console.error(error);
            });

            get(ref(db, `users/${user}/inventory/${data.reaction}`)).then((snapshot) => {
              set(ref(db, `users/${user}/inventory/${data.reaction}`), snapshot.val() + 1);
            }).catch((error) => {
              console.error(error);
            });
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    });
  };

  return (
    <div>
      <center>
        <h1>Suggest</h1>
      </center>
      <center>
        <form onSubmit={handleSubmit(onSubmit)}>
          <center>
            <input {...register("e1")} placeholder="Element 1" />
            <p style={{fontSize:25}}>+</p>
            <input {...register("e2")} placeholder="Element 2" />
            <p style={{fontSize:25}}>=</p>
            <input {...register("reaction")} placeholder="Reaction" />
            <p>{result}</p>
            <input type="submit" />
          </center>
        </form>
      </center>
    </div>
  );
};