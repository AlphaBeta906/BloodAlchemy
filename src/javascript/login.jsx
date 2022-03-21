import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from "firebase/database";
import { sha256 } from 'js-sha256';
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import UserContext from "./userContext";
import firebaseConfig from "./firebase";
import Error from "./error";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [token, setToken] = useState("");

  const onSubmit = async (data) => {
    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    if (data.username === "" || data.password === "") {
      setResult(
        <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
          <p class="font-bold">⚠️ Warning ⚠️</p>
          <p class="text-sm">Please fill in all fields!</p>
        </div>
      );
    } else if (token === "") {
      setResult(
        <div class="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
          <p class="font-bold">⚠️ Warning ⚠️</p>
          <p class="text-sm">Please verify that you are not a robot!</p>
        </div>
      );
    } else {
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
  };

  if (user === '') {
    return (
      <div>
          <center>
            <p class="text-2xl">Login</p>
          </center>
          <center>
              <GoogleReCaptcha
                onVerify={(token) => setToken(token)}
              />
              <form onSubmit={handleSubmit(onSubmit)} class="bg-white dark:bg-slate-400 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
                  <center>
                    <input {...register("username")} placeholder="Username" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /><br />
                    <input {...register("password")} placeholder="Password" type="password" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /><br/><br />
                    <input type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" /><br /><br />
                    <p>{result}</p>
                  </center>
              </form>
          </center>

          <footer>
            <Ads/><br/>
          </footer>
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