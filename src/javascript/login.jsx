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
        setResult(
          <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
            <p class="font-bold">🛑 Error 🛑</p>
            <p class="text-sm">Incorrect username or password.</p>
          </div>
        );
      }
    }).catch((error) => {
      setResult(
        <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
          <p class="font-bold">🛑 Error 🛑</p>
          <p class="text-sm">{error.toString()}</p>
        </div>
      );
    });
  };

  if (user === '') {
    return (
      <div>
          <center>
            <p class="text-2xl">Login</p>
          </center>
          <center>
              <form onSubmit={handleSubmit(onSubmit)} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
                  <center>
                    <input {...register("username")} placeholder="Username" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /><br />
                    <input {...register("password")} placeholder="Password" type="password" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /><br/><br />
                    <input type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" /><br /><br />
                    <p>{result}</p>
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