import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./userContext";

export default function Home() {
    const { user } = useContext(UserContext);

    const d = new Date();
    let text = d.toUTCString();
    var message = "";

    if (user === "") {
      message = (
        <div>
          You are not logged in. Please <Link to='/login'>login</Link> or <Link to='/signin'>signin</Link>.
        </div>
      );
    } else {
      if (["AlphaBeta906", "ItzCountryballs"].includes(user)) {
        message = (
          <div>
            You are logged in as {user}. <Link to='/test'>Test</Link>
          </div>
        );
      } else {
        message = (
          <div>
            You are logged in as {user}. <Link to='/signout'>Sign-Out</Link>
          </div>
        );
      }
    }
    
    return (
        <div>
            <center>
                <h1>Home</h1>
                <h6>"Elements and stuff, I don't know" - me</h6>

                {text}<br></br>
                {message}
            </center>
        </div>
    );
}