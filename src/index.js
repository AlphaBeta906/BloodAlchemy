import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  Routes, 
  Route,
  Link,
  Navigate
} from "react-router-dom";
import {
  GoogleReCaptchaProvider
} from 'react-google-recaptcha-v3';

import Home from "./javascript/home";
import About from "./javascript/about";
import Contact from "./javascript/contact";
import Play from "./javascript/play";
import Suggest from "./javascript/suggest";
import Login from "./javascript/login";
import Signin from "./javascript/signin";
import Mine from "./javascript/mine";
import Test from "./javascript/test";
import Profile from "./javascript/profile";
import Inventory from "./javascript/inventory";
import Info from "./javascript/info";
import Buy from "./javascript/buy";
import Menu from "./javascript/menu";
import Sell from './javascript/sell';
import Suggestions from './javascript/suggestions';
import Suggestion from './javascript/suggestion';
import Search from "./javascript/search";
import Attack from "./javascript/attack";
import Upgrade from "./javascript/upgrade";
import EditArticle from './javascript/editArticle';
import Function from './javascript/function';
import FunctionSuggest from './javascript/functionSuggest';
import Bug from './javascript/bug';
import Signout from "./javascript/signout";
import FAQ from './javascript/faq';
import UpdateLog from './javascript/updatelog';
import Hint from './javascript/hint';
import Ranks from './javascript/ranks';
import BETAFeatures from './javascript/beta-features';
import AdminPanel from './javascript/admin-panel';
import Games from './javascript/games';

import ProfileNoArgs from './javascript/profileNoArgs';
import InventoryNoArgs from './javascript/inventoryNoArgs';
import InfoNoArgs from './javascript/infoNoArgs';
import HintNoArgs from './javascript/hintNoArgs';

import Error from './javascript/error';
import Empty from "./javascript/empty";
import Tips from './javascript/tips';

import UserContext from "./javascript/userContext";

function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    document.title = "Blood Alchemy (BETA)";
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      <GoogleReCaptchaProvider reCaptchaKey="6Lc1xiUeAAAAAE2dX4hyl9Pe9MmLWnXpmgipZ8CM">
      <div class="bg-white text-black dark:bg-gray-800 dark:text-white transition-all px-2 py-2" style={{minHeight: "100vh"}}>        
        <Router>
            <Empty />
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="BloodAlchemy" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="faq" element={<FAQ />} />
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
                <Route path="menu">
                  <Route index element={<Navigate to="/menu/1/" />} />
                  <Route path=":index" element={<Menu />} />
                </Route>
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
                <Route path="bugs" element={<Bug />} />
                <Route path="signout" element={<Signout />} />
                <Route path="updatelog" element={<UpdateLog />} />
                <Route path="hint">
                  <Route index element={<HintNoArgs />} />
                  <Route path=":elem" element={<Hint />} />
                </Route>
                <Route path="ranks" element={<Ranks />} />
                <Route path="beta" element={<BETAFeatures />} />
                <Route path="admin" element={<AdminPanel />} />
                <Route path="games" element={<Games />} />
                <Route path="*" element={<Error status="404" />} />
            </Routes>

            <footer>
              <br /><br /><br />
              <small><center><Link to="/bugs">Report a Bug</Link></center></small><br />
              <Tips /><br />
              <br/>
              <div class="flex-grow border-8 border-red-400 rounded-md shadow-md"></div>
              <center>&copy; AlphaBeta906, AlphaBeta906 LLC (nonexisting thing joke), 2021</center>
              <div class="flex-grow border-8 border-red-400 rounded-md shadow-md"></div>
              <br/>
            </footer>
        </Router>
      </div>
      </GoogleReCaptchaProvider>
    </UserContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));  

// So that I don't forget, December 17th, 2020 is the day that I started this project.
