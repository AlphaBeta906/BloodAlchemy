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
      setResult(`Please wait ${seconds} seconds`);
    } else if (randomInt(2) === 0) {
      setResult("You didn't find anything...");
    } else if (data.mine === "") {
      setResult("You didn't enter a mine name");
    } else {
      get(ref(db, `mines/${data.mine}`)).then((snapshot) => {
        if (snapshot.val() === undefined) {
          setResult("That mine doesn't exist");
        } else if (snapshot.val().owner !== user) {
          setResult("You don't own that mine");
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
              setResult("Error: " + error.toString());
            });

            setResult(<div>
              <p>You found a <Link to={`/info/${element}`}>{element}</Link> element!</p>
            </div>);
          }).catch((error) => {
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
      setResult("Error: " + error.toString());
    });
  }, [seconds, user]);

  if (user !== '') {
    return (
        <div>
            <center>
              <p class="text-2xl">Mine</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <p>Mines: {mines} | Need more mines? <Link to="/attack/">Go</Link> <Link to="/search/">here</Link>!</p>
                <input {...register("mine")} placeholder="Mine" /><br />
                <input type="submit" />
                <p>{result}</p>
              </form>
            </center>
        </div>
    );
  } else {
    return (
      <Error status="401" />
    ); 
  }
}