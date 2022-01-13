import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import { sha256 } from 'js-sha256';
import UserContext from "./userContext";
import firebaseConfig from "./firebase";
import Error from "./error";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const { user, setUser } = useContext(UserContext);

  const onSubmit = async (data) => {
    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    get(ref(db, `users/${data.username}/password`)).then((snapshot) => {
      if (snapshot.val() === sha256(data.password)) {
        setUser(data.username);
        setResult(
          <Navigate to="/"/>
        );
      } else {
        setResult("Incorrect username or password!");
      }
    }).catch((error) => {
      setResult(error.toString());
    });
  };

  if (user === '') {
    return (
      <div>
          <center>
            <p class="text-2xl">Login</p>
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
      <Error status="204" />
    );
  } else {
    return result;
  }
}