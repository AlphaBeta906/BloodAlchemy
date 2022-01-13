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
      setResult(
        <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
          <p class="font-bold">ℹ️ Info ℹ️</p>
          <p class="text-sm">Please wait {seconds} seconds.</p>
        </div>
      )
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
          <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
            <p class="font-bold">ℹ️ Info ℹ️</p>
            <p class="text-sm">No reaction ( {first} + {second} ) <Link to="/suggest">Suggest?</Link>.</p>
          </div>
        );
      } else {
        // MY WATER IS ALL GONE THANKS TO CODE THAT WAS USEFUL BEFORE BUT NOW ITS NOT GAH I NEED TO WORK NOW
        // NOT MAKING THIS SILLY COMMENT AAA
        // fuck, lost 4000 water elements

        get(ref(db, `users/${user}/inventory`)).then((snapshotw) => {
          if (snapshotw.val()[first] <= 0 || snapshotw.val()[first] === undefined) {
            setResult(
              <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
                <p class="font-bold">⚠️ Warning ⚠️</p>
                <p class="text-sm">The element <Link to={'/info/' + first}>{first}</Link> is not in your inventory! You can buy more <Link to={'/buy/' + first}>here</Link>.</p>
              </div>
            );
          } else if (snapshotw.val()[second] <= 0 || snapshotw.val()[second] === undefined) {
            setResult(
              <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
                <p class="font-bold">⚠️ Warning ⚠️</p>
                <p class="text-sm">The element <Link to={'/info/' + second}>{second}</Link> is not in your inventory! You can buy more <Link to={'/buy/' + second}>here</Link>.</p>
              </div>
            );
          } else if (first === second && snapshotw.val()[first] < 2) { 
            setResult(
              <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
                <p class="font-bold">⚠️ Warning ⚠️</p>
                <p class="text-sm">The element <Link to={'/info/' + second}>{second}</Link> is not in your inventory! You can buy more <Link to={'/buy/' + second}>here</Link>.</p>
              </div>
            );
          } else {
            var reaction = ""

            if (reactions[first + "+" + second] !== undefined) {
              reaction = reactions[first + "+" + second]
            } else {
              reaction = reactions[second + "+" + first]
            }

            get(ref(db, `elements/${reaction}`)).then((snapshot1) => {
              get(ref(db, `users/${user}`)).then((snapshotx) => {
                var watts = snapshot1.val().generation * snapshot1.val().complexity + gDTRGB(snapshot1.val().color) * snapshotx.val().level;
                watts = Math.ceil(watts);

                set(ref(db, `users/${user}/watts`), snapshotx.val()["watts"] + watts);

                setResult(
                  <div class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 w-64" role="alert">
                    <p class="font-bold">✅ Success ✅</p>
                    <p class="text-sm">You have created {reaction}, which gives you {watts} watts!</p>
                  </div>
                )
              })
            }).catch((error) => {
              setResult(
                <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                  <p class="font-bold">🛑 Error 🛑</p>
                  <p class="text-sm">{error.toString()}</p>
                </div>
              );
            });

            get(ref(db, `users/${user}/inventory/`)).then((snapshot3) => {
              set(ref(db, `users/${user}/inventory/${first}`), snapshot3.val()[first] - 1);
              set(ref(db, `users/${user}/inventory/${second}`), snapshot3.val()[second] - 2);
            }).catch((error) => {
              setResult(
                <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                  <p class="font-bold">🛑 Error 🛑</p>
                  <p class="text-sm">{error.toString()}</p>
                </div>
              );
            });

            get(ref(db, `users/${user}/inventory/${reaction}`)).then((snapshot4) => {
              if (!snapshot.exists()) {
                set(ref(db, `users/${user}/inventory/${reaction}`), 1);
              } else {
                set(ref(db, `users/${user}/inventory/${reaction}`), snapshot4.val() + 1);
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
        }).catch((error) => {
          console.error(error);
        });
      }
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
            <p class="text-2xl">Play</p>
          </center>
          <center>
              <form onSubmit={handleSubmit(onSubmit)} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <center>
                    <input {...register("e1")} placeholder="Element 1" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    <p style={{fontSize:25, fontWeight:"bold"}}>+</p>
                    <input {...register("e2")} placeholder="Element 2" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /><br/><br/>
                    <input type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" /><br/><br/>
                    <p>{result}</p>
                  </center>
              </form>

              <p>Need more resources? <Link to="/mine">Go here</Link>. Inventory? <Link to="/inventory">Go here.</Link> <Link to="/function/">Change mode</Link></p>
          </center>
      </div>
    );
  } else {
    return (
      <Error status="401" />
    )
  }
}