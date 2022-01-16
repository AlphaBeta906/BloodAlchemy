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
          You are not logged in. Please <Link to='/login'>login</Link> or <Link to='/signin'>signin</Link> to play Blood Alchemy.
        </div>
      );
    } else {
      if (["AlphaBeta906", "ItzCountryballs"].includes(user)) {
        message = (
          <div>
            You are logged in as {user}. <Link to='/signout'>Sign-Out</Link>. <Link to={'/profile/' + user}>Profile</Link><br />
            Since you are an administrator, Please go to the <Link to='/test'>Test</Link> page if you wanna create/test new features for the website.
          </div>
        );
      } else {
        if (["AmorAltra" , "AetherDX"].includes(user)) {
          message = (
            <div>
            You are logged in as {user}. <Link to='/signout'>Sign-Out</Link>. <Link to={'/profile/' + user}>Profile</Link><br />
            Do you really think we Blood Alchemy developers don't know what you did?
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
  }
    
    return (
        <div>
            <center>
                <p class="text-2xl">Blood Alchemy Version 1.20.7</p>
<<<<<<< HEAD
                <Link to='/updatelog'>Update Log</Link>
                <p class="text-2xl">Home</p>
=======
                <Link to='/updatelog'>Update Log</Link><br />
>>>>>>> 1c4be9f765314ac24e8ccd4019952016c63c4bdf
                <p class="text-sm">"Elements and stuff, I don't know" - me</p><br/><br/>

                {text}<br></br>
                {message}
            </center>
        </div>
    );
}