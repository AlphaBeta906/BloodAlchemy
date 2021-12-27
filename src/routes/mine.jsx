import { useState, useContext, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from "firebase/database";
import { Link } from "react-router-dom";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";

export default function Mine() {
  const [result, setResult] = useState("");
  const [seconds, setSeconds] = useState(0);
  const { user } = useContext(UserContext);

  const onSubmit = () => {
    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    if (seconds !== 0) {
      setResult(`Please wait ${seconds} seconds`);
      return;
    } else if (Math.floor(Math.random() * 2) === 0) {
      setResult("You didn't find anything...");
    } else {
      setSeconds(10);

      var complexity = 1;

      while (true) {
        if (Math.random() === 1) {
          complexity++;
        } else {
          break
        }
      }

      get(ref(db, `elements`)).then((snapshot) => {
        var max_complexity = 0;
        
        snapshot.forEach((element) => {
          if (element.val().complexity > max_complexity) {
            max_complexity = element.val().complexity;
          }
        });

        if (complexity > max_complexity) {
          complexity = max_complexity;
        }

        var elements_with_complexity = [];

        snapshot.forEach((element) => {
          if (element.val().complexity === complexity) {
            elements_with_complexity.push(element.key);
          }
        });

        var element = elements_with_complexity[Math.floor(Math.random() * elements_with_complexity.length)];

        get(ref(db, `users/${user}/inventory`)).then((snapshot) => {
          if (snapshot.val()[element] === undefined) {
            set(ref(db, `users/${user}/inventory/${element}`), 1);
          } else {
            set(ref(db, `users/${user}/inventory/${element}`), snapshot.val()[element] + 1);
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
  }

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
              <h1>Mine</h1>
            </center>
            <center>
                <p>{result}</p>
                <button onClick={onSubmit}>Mine</button>
            </center>
        </div>
    );
  } else {
    return (
        <div>
          <center>
            <p style={{fontSize: 100}}>403</p>
            <p style={{fontSize: 50}}>Forbidden. Sign in to enter the page.</p>
          </center>
        </div>
    ); 
  }
}