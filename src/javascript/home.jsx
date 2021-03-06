import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./userContext";
import Ads from './ads';

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
                <p class="text-2xl">Blood Alchemy Version 1.20.9.2</p>
                <Link to='/updatelog'>Update Log</Link><br />
                <p class="text-sm">"Elements and stuff, I don't know" - me</p><br/><br/>

                {text}<br></br>
                {message}
            </center>

            <footer>
                <Ads/><br/>
            </footer>
        </div>
    );
}