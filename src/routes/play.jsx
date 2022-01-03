import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from "firebase/database";
import { gDTRGB } from "./colorDistance";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";
import Error from "./error";

export default function Play() {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const [seconds, setSeconds] = useState(0);
  const { user } = useContext(UserContext);

  const onSubmit = (data) => {
    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    if (seconds !== 0) {
      setResult(`Please wait ${seconds} seconds`);
      return;
    }

    setSeconds(5);

    // I hate rewriting legacy code
    get(ref(db, 'reactions')).then((snapshot) => {
      var reactions = {};

      snapshot.forEach(snap => {
        reactions[snap.key] = snap.val();
      });
      
      var first = data.e1
      var second = data.e2

      if (reactions[first + "+" + second] === undefined && reactions[second + "+" + first] === undefined) {
        setResult(
          <>
            No reaction ( {first} + {second} )<br />
            <Link to="/suggest">Suggest?</Link>
          </>
        );
      } else {
        // MY WATER IS ALL GONE THANKS TO CODE THAT WAS USEFUL BEFORE BUT NOW ITS NOT GAH I NEED TO WORK NOW
        // NOT MAKING THIS SILLY COMMENT AAA
        // fuck, lost 4000 water elements

        get(ref(db, `users/${user}/inventory`)).then((snapshot) => {
          if (snapshot.val()[first] <= 0 || snapshot.val()[first] === undefined) {
            setResult(
              <>
                The element <Link to={'/info/' + first}>{first}</Link> is not in your inventory! You can buy more <Link to={'/buy/' + first}>here</Link>.
              </>
            );
          } else if (snapshot.val()[second] <= 0 || snapshot.val()[second] === undefined) {
            setResult(
              <>
                The element <Link to={'/info/' + first}>{second}</Link> is not in your inventory! You can buy more <Link to={'/buy/' + second}>here</Link>.
              </>
            );
          } else {
            if (reactions[first + "+" + second] !== undefined) {
              get(ref(db, `elements/${reactions[first + "+" + second]}`)).then((snapshot1) => {
                get(ref(db, `users/${user}`)).then((snapshot) => {
                  var watts = snapshot1.val().generation * snapshot1.val().complexity + gDTRGB(snapshot1.val().color) * snapshot.val().level;
                  watts = Math.ceil(watts);

                  set(ref(db, `users/${user}/watts`), snapshot.val()["watts"] + watts);

                  setResult(<>
                    You got one You got one <Link to={'/info/' + reactions[first + "+" + second]}>{reactions[first + "+" + second]}</Link>!<br />
                    <span style={{ color: "#ffcc00" }}>⚡️ You got {watts} watts!</span>
                  </>)
                })
              }).catch((error) => {
                setResult("Error: " + error.toString());
              });

              get(ref(db, `users/${user}/inventory/${first}`)).then((snapshot) => {
                set(ref(db, `users/${user}/inventory/${first}`), snapshot.val() - 1);
              }).catch((error) => {
                setResult("Error: " + error.toString());
              });

              get(ref(db, `users/${user}/inventory/${second}`)).then((snapshot) => {
                set(ref(db, `users/${user}/inventory/${second}`), snapshot.val() - 1);
              }).catch((error) => {
                setResult("Error: " + error.toString());
              });

              get(ref(db, `users/${user}/inventory/${reactions[first + "+" + second]}`)).then((snapshot) => {
                if (!snapshot.exists()) {
                  set(ref(db, `users/${user}/inventory/${reactions[first + "+" + second]}`), 1);
                } else {
                  set(ref(db, `users/${user}/inventory/${reactions[first + "+" + second]}`), snapshot.val() + 1);
                }
              }).catch((error) => {
                setResult("Error: " + error.toString());
              });
            } else {
              get(ref(db, `elements/${reactions[second + "+" + first]}`)).then((snapshot1) => {
                get(ref(db, `users/${user}`)).then((snapshot) => {
                  var watts = snapshot1.val().generation * snapshot1.val().complexity + gDTRGB(snapshot1.val().color) * snapshot.val().level;
                  watts = Math.ceil(watts);

                  set(ref(db, `users/${user}/watts`), snapshot.val()["watts"] + watts);

                  setResult(<>
                    You got one <Link to={'/info/' + reactions[second + "+" + first]}>{reactions[second + "+" + first]}</Link>!<br />
                    <span style={{ color: "#ffcc00" }}>⚡️ You got {watts} watts!</span>
                  </>)
                });
              }).catch((error) => {
                setResult("Error: " + error.toString());
              });

              get(ref(db, `users/${user}/inventory/${first}`)).then((snapshot) => {
                set(ref(db, `users/${user}/inventory/${first}`), snapshot.val() - 1);
              }).catch((error) => {
                setResult("Error: " + error.toString());
              });

              get(ref(db, `users/${user}/inventory/${second}`)).then((snapshot) => {
                set(ref(db, `users/${user}/inventory/${second}`), snapshot.val() - 1);
              }).catch((error) => {
                setResult("Error: " + error.toString());
              });

              get(ref(db, `users/${user}/inventory/${reactions[second + "+" + first]}`)).then((snapshot) => {
                if (snapshot === null) {
                  set(ref(db, `users/${user}/inventory/${reactions[second + "+" + first]}`), 1);
                } else {
                  set(ref(db, `users/${user}/inventory/${reactions[second + "+" + first]}`), snapshot.val() + 1);
                }
              }).catch((error) => {
                setResult("Error: " + error.toString());
              });
            }
          }
        }).catch((error) => {
          console.error(error);
        });
      };
    }).catch((error) => {
      console.error(error)
    });
  };

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(0);
    }
  }, [seconds]);
  
  if (user !== '') {
    return (
      <div>
          <center>
            <h1>Play</h1>
          </center>
          <center>
              <form onSubmit={handleSubmit(onSubmit)}>
                  <center>
                    <input {...register("e1")} placeholder="Element 1" />
                    <p style={{fontSize:25, fontWeight:"bold"}}>+</p>
                    <input {...register("e2")} placeholder="Element 2" />
                    <p>{result}</p>
                    <input type="submit" />
                    <p>Need more resources? <Link to="/mine">Go here</Link>. Inventory? <Link to="/inventory">Go here.</Link> <Link to="/function/">Change mode</Link></p>
                  </center>
              </form>
          </center>
      </div>
    );
  } else {
    return (
      <Error status="401" />
    )
  }
}