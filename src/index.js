import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
    BrowserRouter as Router,
    Routes, 
    Route 
} from "react-router-dom";

import Home from "./home";
import About from "./about";
import Contact from "./contact";
import Play from "./play";
import Suggest from "./suggest";
import Login from "./login";
import Signin from "./signin";
import Mine from "./mine";
import Test from "./test";
import Profile from "./profile";
import Inventory from "./inventory";
import Info from "./info";
import Buy from "./buy";
import Menu from "./menu";
import Sell from './sell';
import Suggestions from './suggestions';
import Suggestion from './suggestion';
import Search from "./search";
import Attack from "./attack";
import Upgrade from "./upgrade";
import EditArticle from './editArticle';
import Function from './function';
import FunctionSuggest from './functionSuggest';

import ProfileNoArgs from './profileNoArgs';
import InventoryNoArgs from './inventoryNoArgs';
import InfoNoArgs from './infoNoArgs';

import Error from './error';
import Empty from "./empty";
import Tips from './tips';

import UserContext from "./userContext";
// import reportWebVitals from './reportWebVitals';

function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    document.title = "Blood Alchemy";
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      <>        
        <Router>
            <Empty />
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="play" element={<Play />} />
                <Route path="suggest" element={<Suggest />} />
                <Route path="login" element={<Login />} />
                <Route path="signin" element={<Signin />} />
                <Route path="mine" element={<Mine />} />
                <Route path="test" element={<Test />} />
                <Route path="profile">
                  <Route index element={<ProfileNoArgs />} />
                  <Route path=":user" element={<Profile />} />
                </Route>
                <Route path="inventory">
                  <Route index element={<InventoryNoArgs />} />
                  <Route path=":user" element={<Inventory />} />
                </Route>
                <Route path="info">
                  <Route index element={<InfoNoArgs />} />
                  <Route path=":element" element={<Info />} />
                </Route>
                <Route path="buy">
                  <Route index element={<Menu />} />
                  <Route path=":elem" element={<Buy />} />
                </Route>
                <Route path="sell">
                  <Route index element={<Menu />} />
                  <Route path=":elem" element={<Sell />} />
                </Route>
                <Route path="menu" element={<Menu />} />
                <Route path="suggestions" element={<Suggestions />} />
                <Route path="suggestion">
                  <Route index element={<Suggestions />} />
                  <Route path=":suggestion" element={<Suggestion />} />
                </Route>
                <Route path="search" element={<Search />} />
                <Route path="attack" element={<Attack />} />
                <Route path="upgrade" element={<Upgrade />} />
                <Route path="edit">
                  <Route index element={<Error status="400" />} />
                  <Route path=":elem" element={<EditArticle />} />
                </Route>
                <Route path="function" element={<Function />} />
                <Route path="suggestFunct" element={<FunctionSuggest />} />
                <Route path="*" element={<Error status="404" />} />
            </Routes>

            <footer>
              <br /><br /><br />
              <Tips />
              <hr />
              <center>&copy; AlphaBeta906, AlphaBeta906 LLC (nonexisting thing joke), 2021</center>
              <hr />
            </footer>
        </Router>
      </>
    </UserContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));  

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();