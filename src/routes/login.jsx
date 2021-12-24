import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from "firebase/database";
import { sha256 } from 'js-sha256';
import UserContext from "./userContext";

const firebaseConfig = {
  apiKey: "AIzaSyC2OA4hzyK73YLd41F3IPRRuhVciy532xQ",
  authDomain: "elementals4.firebaseapp.com",
  databaseURL: "https://elementals4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "elementals4", 
  storageBucket: "elementals4.appspot.com",
  messagingSenderId: "493819791208",
  appId: "1:493819791208:web:00ecc6ec14821d1514f8dd",
};

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const { user, setUser } = useContext(UserContext);

  const onSubmit = async (data) => {
    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    var user = ref(db, 'users/' + data.username);
    onValue(user, (snapshot) => {
      if (snapshot.val()["password"] === sha256(data.password)) {
        setUser(data.username);
        setResult(
          <Navigate to="/"/>
        );
      } else {
        setResult("Login Failed, sussy baka!");
      }
    });
  };

  if (user === '') {
    return (
      <div>
          <center>
            <h1>Login</h1>
          </center>
          <center>
              <form onSubmit={handleSubmit(onSubmit)}>
                  <center>
                    <input {...register("username")} placeholder="Username" /><br />
                    <input {...register("password")} placeholder="Password" type="password" />
                    <p>{result}</p>
                    <input type="submit" />
                  </center>
              </form>
          </center>
      </div>
    );
  } else if (result === "") {
    return (
      <div>
        <center>
          <p style={{fontSize: 100}}>204</p>
          <p style={{fontSize: 50}}>No Content. You already signed in!</p>
        </center>
      </div>
    );
  } else {
    return result;
  }
}