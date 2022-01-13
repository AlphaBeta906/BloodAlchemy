import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from "firebase/database";
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

    var reaction = ref(db, 'reactions');
    onValue(reaction, (snapshot) => {
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
        set(ref(db, 'suggestions/' + data.e1 + "+" + data.e2 + "=" + data.reaction), { 
          votes: 0,
          creator: user
        });
        setResult("👍 Suggestion added!");
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
          <p class="text-2xl">Suggest</p>
        </center>
        <center>
          <form onSubmit={handleSubmit(onSubmit)} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <center>
              <input {...register("e1")} placeholder="Element 1" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              <p style={{fontSize:25, fontWeight:"bold"}}>+</p>
              <input {...register("e2")} placeholder="Element 2" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              <p style={{fontSize:25, fontWeight:"bold"}}>=</p>
              <input {...register("reaction")} placeholder="Reaction" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /><br /><br />
              <input type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" /><br /><br />
              <p>{result}</p>
            </center>
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