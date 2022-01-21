import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from "firebase/database";
import { gDTRGB } from "./colorDistance";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";
import Error from "./error";

export default function BETAFeatures() {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const [seconds, setSeconds] = useState(0);
  const { user } = useContext(UserContext);

  function getCombination(combination) {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
  
    const new_combination = combination.sort().join("+");
  
    get(ref(db, 'reactions')).then((snap) => {
      snap.forEach((reaction) => {
        const new_reaction = reaction.key.split("+").sort().join("+");
  
        if (new_combination === new_reaction) {
          console.log(snap.val()[reaction.key]);
          localStorage.removeItem("reaction");
          localStorage.setItem("reaction", snap.val()[reaction.key]);
        }
      })
    })
  }
  
  function requires(combination, inventory, getRequires=false) {
    const requires2 = [];
  
    combination.forEach((element) => {
      if (inventory[element] === undefined || inventory[element] < requires2[element]) {
        return false
      } else {
        requires2[element] += 1;
      }
    });
  
    if (getRequires) {
      return requires2;
    } else {
      return true;
    }
  }

  const onSubmit = (data) => {
    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    var elements = []

    for (var i = 1; i < 3; i++) {
      elements.push(data["e" + i])
    }

    if (seconds !== 0) {
      setResult(
        <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
          <p class="font-bold">ℹ️ Info ℹ️</p>
          <p class="text-sm">Please wait for {seconds} seconds.</p>
        </div>
      )
    } else if (data.e1 === "" || data.e2 === "" || data.e3 === "") {
      setResult(
        <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
          <p class="font-bold">⚠️ Warning ⚠️</p>
          <p class="text-sm">Please fill in all fields.</p>
        </div>
      )
    } else {
      get(ref(db, `users/${user}`)).then((snapshot) => {
        setSeconds(5);

        if (requires(elements, snapshot.val().inventory) === false) {
          setResult(
            <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
              <p class="font-bold">⚠️ Warning ⚠️</p>
              <p class="text-sm">You have not enough elements.</p>
            </div>
          )
        } else {
          getCombination(elements);
          var reaction = localStorage.reaction;

          if (reaction === false) {
            setResult(
              <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
                <p class="font-bold">ℹ️ Info ℹ️</p>
                <p class="text-sm">No reaction found ( {elements.join(" + ")} ).</p>
              </div>
            )
          } else {
            get(ref(db, `elements/${reaction}`)).then((snapshot2) => {
              var watts = snapshot2.val().generation * snapshot2.val().complexity + gDTRGB(snapshot2.val().color) * snapshot.val().level;
              watts = Math.ceil(watts);

              setResult(
                <div class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 w-64" role="alert">
                  <p class="font-bold">✅ Success ✅</p>
                  <p class="text-sm">You have created <Link to={"/info/" + reaction}>{reaction}</Link>, which gives you {watts} watts!</p>
                </div>
              )

              const requires3 = requires(elements, snapshot.val().inventory, true)
              
              requires3.forEach((element) => {
                set(ref(db, `users/${user}/inventory/${element}`), snapshot.val().inventory[element] - requires3[element]);
              })  

              set(ref(db, `users/${user}/watts`), snapshot.val().watts + watts);

              if (snapshot.val().inventory[reaction] === undefined) {
                set(ref(db, `users/${user}/inventory/${reaction}`), 1);
              } else {
                set(ref(db, `users/${user}/inventory/${reaction}`), snapshot.val().inventory[reaction] + 1);
              }
            }).catch((error) => {
              setResult(
                <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                  <p class="font-bold">🛑 Error 🛑</p>
                  <p class="text-sm">{error.toString()}</p>
                </div>
              )
            })
          }
        }
      }).catch((error) => {
        setResult(
          <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
            <p class="font-bold">🛑 Error 🛑</p>
            <p class="text-sm">{error.toString()}</p>
          </div>
        )
      })
    }
  };
  
  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(0);
    }
  }, [seconds]);
  
  if (["AlphaBeta906", "ItzCountryballs", "Nv7", "oli"].includes(user)) {
    return (
      <div>
          <center>
            <p class="text-2xl">Play</p>
            <span class="text-s bg-red-800 px-2 py-1 rounded-full" style={{"fontFamily": "Octin Spraypaint"}}>EXCLUSIVE BETA FEATURE</span>
          </center><br /><br />
          <center>
              <form onSubmit={handleSubmit(onSubmit)} class="bg-white dark:bg-slate-400 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
                  <center>
                    <input {...register("e1")} placeholder="Element 1" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    {[...Array(2 - 1).keys()].map((i) => {
                      return (
                        <div>
                          <p style={{fontSize:25, fontWeight:"bold"}}>+</p>
                          <input {...register("e" + (i + 2))} placeholder={`Element ` + (i+2).toString()} class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                      )
                    })}<br /><br />
                    <input type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" /><br /><br />
                    <p>{result}</p><br /><br />
                    <div class="flex items-center justify-center w-full mb-12">
                      <label for="toggleB" class="flex items-center cursor-pointer">
                        <div class="relative">
                          <input type="checkbox" id="toggleB" class="sr-only" />
                          <div class="line block bg-gray-500 w-14 h-8 rounded-full"></div>
                          <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                        </div>
                      </label>
                    </div>
                  </center>
              </form><br /><br />

              <p>Need more resources? <Link to="/mine">Go here</Link>. Inventory? <Link to="/inventory">Go here.</Link> <Link to="/function/">Change mode</Link></p>
              <p>This is Part 1 of the BETA Features in Blood Alchemy, More features will be coming soon!</p>
          </center>
      </div>
    );
  } else {
    return (
      <Error status="404" />
    )
  }
}