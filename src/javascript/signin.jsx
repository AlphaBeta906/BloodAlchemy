import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from "firebase/database";
import { sha256 } from 'js-sha256';
import UserContext from "./userContext";
import firebaseConfig from "./firebase";
import Error from "./error";

export default function Signin() {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const { user, setUser } = useContext(UserContext);

  const onSubmit = async (data) => {
    var app = initializeApp(firebaseConfig);
    var db = getDatabase(app);

    if (data.username === "" || data.password === "" || data.confirm === "") {
      setResult("Please fill in all fields");
    } else if (data.password !== data.confirm) {
      setResult("Passwords do not match!");
    } else {
      get(ref(db, 'users/')).then(snapshot => {
        if (snapshot.val()[data.username] !== undefined) {
          setResult("Username already exists!");
        } else {
          if (user === "") {
            setUser(user);

            set(ref(db, 'users/' + data.username), {
                class: "slave",
                level: 1,
                inventory: {
                    Fire: 1,
                    Water: 1,
                    Earth: 1,
                    Air: 1,
                },
                password: sha256(data.password),
                watts: 0
            });

            get(ref(db, 'mines/')).then(snapshot => {
              var mines = Object.keys(snapshot.val()).length;

              set(ref(db, 'mines/Mine ' + (mines + 1).toString()), {
                owner: user,
                start: 1
              })

              setResult(
                <Navigate to="/"/>
              );
            }).catch(error => {
              setResult("Error: " + error.toString());
            })
          } else {
            setResult("You are already logged in!");
          }
        }
      }).catch(error => {
        setResult(error);
      });
    }
  };

  if (user === '') {
    return (
      <div>
          <center>
              <form onSubmit={handleSubmit(onSubmit)}>
                  <center>
                    <input {...register("username")} placeholder="Username" /><br />
                    <input {...register("password")} placeholder="Password" type="password" /><br />
                    <input {...register("confirm")} placeholder="Password" type="password" />
                    <p>{result}</p><br />
                    <input type="submit" />
                  </center>
              </form>
          </center>
      </div>
    );
  } else if (result === "") {
    return (
      <Error status="204" />
    )
  } else {
    return result;
  }
}