import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./userContext";

export default function Home() {
    const { user } = useContext(UserContext);

    const d = new Date();
    let text = d.toUTCString();

    return (
        <div>
            <center>
                <h1>Home</h1>
                <h6>"Elements and stuff, I don't know"</h6>

                {text}<br></br>
                {user === '' ? (
                  <div>
                    Account not signed in. <Link to="/signin">Sign up</Link> or <Link to="/login">Login</Link> to play with all of the features!
                  </div>
                ) : ['AlphaBeta906', 'ItzCountryballs'].includes(user) ? (
                  <div>
                    Welcome {user}! You are signed in.<br />
                    <Link to="/test">Test</Link>
                  </div>
                  ) : (<div>
                    Welcome {user}! You are signed in.
                  </div>)}
            </center>
        </div>
    );
}