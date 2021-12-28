import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get } from "firebase/database";
import { Link } from "react-router-dom";
import UserContext from "./userContext";  
import firebaseConfig from "./firebase";
import Error from "./error";

export default function Suggest() {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const [seconds, setSeconds] = useState(0);
  const { user } = useContext(UserContext);

  const onSubmit = async (data) => {
    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    if (seconds !== 0) {
      setResult(`Please wait ${seconds} seconds`);
      return;
    }

    setSeconds(5);

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
            set(ref(db, 'suggestions/' + data.e1 + "+" + data.e2 + "=" + data.reaction), { 
              votes: 0,
              creator: user
            });
            setResult("👍 Suggestion added!");
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    });
  };

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(0);
    }
  }, [seconds]);

  if (user !== "") {
    return (
      <div>
        <center>
          <h1>Suggest</h1>
        </center>
        <center>
          <form onSubmit={handleSubmit(onSubmit)}>
            <center>
              <input {...register("e1")} placeholder="Element 1" />
              <p style={{fontSize:25, fontWeight:"bold"}}>+</p>
              <input {...register("e2")} placeholder="Element 2" />
              <p style={{fontSize:25, fontWeight:"bold"}}>=</p>
              <input {...register("reaction")} placeholder="Reaction" />
              <p>{result}</p>
              <input type="submit" />
            </center>
          </form>
        </center>
      </div>
    );
  } else {
    return (
      <Error code="401" />
    );
  }
};