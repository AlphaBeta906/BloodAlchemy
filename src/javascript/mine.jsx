import { useState, useContext, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from "firebase/database";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { randomInt } from './random';
import UserContext from "./userContext";
import firebaseConfig from "./firebase";
import Error from "./error";

export default function Mine() {
  const [result, setResult] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [mines, setMines] = useState([]);
  const { user } = useContext(UserContext);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    if (seconds !== 0) {
      setResult(
        <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
          <p class="font-bold">ℹ️ Info ℹ️</p>
          <p class="text-sm">Please wait {seconds} seconds.</p>
        </div>
      );
    } else if (data.mine === "") {
      setResult(
        <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
          <p class="font-bold">⚠️ Warning ⚠️</p>
          <p class="text-sm">Please fill in all fields.</p>
        </div>
      );
    } else if (randomInt(2) === 0) {
      setResult(
        <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
          <p class="font-bold">ℹ️ Info ℹ️</p>
          <p class="text-sm">You didn't find anything...</p>
        </div>
      )
    } else {
      get(ref(db, `mines/${data.mine}`)).then((snapshot) => {
        if (snapshot.val() === undefined) {
          setResult(
            <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
              <p class="font-bold">⚠️ Warning ⚠️</p>
              <p class="text-sm">Mine does not exist.</p>
            </div>
          );
        } else if (snapshot.val().owner !== user) {
          setResult(
            <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
              <p class="font-bold">⚠️ Warning ⚠️</p>
              <p class="text-sm">You don't own that mine.</p>
            </div>
          );
        } else {
          setSeconds(10);

          var complexity = snapshot.val().start;

          while (true) {
            if (randomInt(1) === 1) {
              complexity++;
            } else {
              break
            }
          }

          get(ref(db, `elements`)).then((snapshot1) => {
            var max_complexity = 0;
            
            snapshot1.forEach((element1) => {
              if (element1.val().complexity > max_complexity) {
                max_complexity = element1.val().complexity;
              }
            });

            if (complexity > max_complexity) {
              complexity = max_complexity;
            }

            var elements_with_complexity = [];

            snapshot1.forEach((element2) => {
              if (element2.val().complexity === complexity) {
                elements_with_complexity.push(element2.key);
              }
            });

            var element = elements_with_complexity[randomInt(elements_with_complexity.length)];

            get(ref(db, `users/${user}/inventory`)).then((snapshot2) => {
              if (snapshot2.val()[element] === undefined) {
                set(ref(db, `users/${user}/inventory/${element}`), 1);
              } else {
                set(ref(db, `users/${user}/inventory/${element}`), snapshot2.val()[element] + 1);
              }
            }).catch((error) => {
              setResult(
                <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                  <p class="font-bold">🛑 Error 🛑</p>
                  <p class="text-sm">{error.toString()}</p>
                </div>
            );
            });

            setResult(
              <div class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 w-64" role="alert">
                <p class="font-bold">✅ Success ✅</p>
                <p class="text-sm">You found 1 <Link to={"/info/" + element}>{element}</Link>!</p>
              </div>
            );
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

    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    get(ref(db, `mines/`)).then((snapshot) => {
      var mines1 = []

      snapshot.forEach((mine) => {
        if (mine.val().owner === user) {
          mines1.push(mine.key);
        }

        setMines(mines1);
      });
    }).catch((error) => {
      setResult(
        <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
          <p class="font-bold">🛑 Error 🛑</p>
          <p class="text-sm">{error.toString()}</p>
        </div>
      );
    });
  }, [seconds, user]);

  if (user !== '') {
    return (
        <div>
            <center>
              <p class="text-2xl">Mine</p>
              <form onSubmit={handleSubmit(onSubmit)} class="bg-white dark:bg-slate-400 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
                <p>Mines: {mines} | Need more mines? <Link to="/attack/">Go</Link> <Link to="/search/">here</Link>!</p><br />
                <input {...register("mine")} placeholder="Mine" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /><br /><br/>
                <input type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" /><br /><br />
                <p>{result}</p>
              </form>
            </center>

            <footer>
              <Ads/><br/>
            </footer>
        </div>
    );
  } else {
    return (
      <Error status="401" />
    ); 
  }
}