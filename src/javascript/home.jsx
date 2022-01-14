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
            You are logged in as {user}. <Link to='/test'>Test</Link>. <Link to={'/profile/' + user}>Profile</Link>
          </div>
        );
      } else {
        message = (
          <div>
            You are logged in as {user}. <Link to='/signout'>Sign-Out</Link>. <Link to={'/profile/' + user}>Profile</Link>
          </div>
        );
      }
    }
    
    return (
        <div>
            <center>
                <p class="text-2xl">Home</p>
                <p class="text-sm">"Elements and stuff, I don't know" - me</p><br/><br/>

                {text}<br></br>
                {message}
            </center>
        </div>
    );
}