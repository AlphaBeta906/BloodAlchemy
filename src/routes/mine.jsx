import { useState, useContext } from "react";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from "firebase/database";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";

export default function Mine() {
  const [result, setResult] = useState("");
  const { user } = useContext(UserContext);

  const onSubmit = () => {
    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    if (Math.floor(Math.random() * 2) === 0) {
      setResult("You didn't find anything...");
    } else {
      var r = Math.floor(Math.random() * 3);

      switch (r) {
        case 0:
          get(ref(db, `users/${user}/inventory/Fire`)).then((snapshot) => {
            set(ref(db, `users/${user}/inventory/Fire`), snapshot.val() + 1);
          }).catch((error) => {
            console.error(error);
          });

          setResult("You found a Fire element!");
          break;
        case 1:
          get(ref(db, `users/${user}/inventory/Water`)).then((snapshot) => {
            set(ref(db, `users/${user}/inventory/Water`), snapshot.val() + 1);
          }).catch((error) => {
            console.error(error);
          });

          setResult("You found a Water element!");
          break;
        case 2:
          get(ref(db, `users/${user}/inventory/Earth`)).then((snapshot) => {
            set(ref(db, `users/${user}/inventory/Earth`), snapshot.val() + 1);
          }).catch((error) => {
            console.error(error);
          });

          setResult("You found an Earth element!");
          break;
        default:
          get(ref(db, `users/${user}/inventory/Air`)).then((snapshot) => {
            set(ref(db, `users/${user}/inventory/Air`), snapshot.val() + 1);
          }).catch((error) => {
            console.error(error);
          });

          setResult("You found an Air element!");
          break;
      }
    }
  }

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