import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
    BrowserRouter as Router,
    Routes, 
    Route 
} from "react-router-dom";

import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Play from "./pages/play";
import Suggest from "./pages/suggest";
import Login from "./pages/login";
import Signin from "./pages/signin";
import Mine from "./pages/mine";
import Test from "./pages/test";
import Profile from "./pages/profile";
import Inventory from "./pages/inventory";
import Info from "./pages/info";
import Buy from "./pages/buy";
import Menu from "./pages/menu";
import Sell from './pages/sell';
import Suggestions from './pages/suggestions';
import Suggestion from './pages/suggestion';
import Search from "./pages/search";
import Attack from "./pages/attack";
import Upgrade from "./pages/upgrade";
import EditArticle from './pages/editArticle';
import Function from './pages/function';
import FunctionSuggest from './pages/functionSuggest';

import ProfileNoArgs from './pages/profileNoArgs';
import InventoryNoArgs from './pages/inventoryNoArgs';
import InfoNoArgs from './pages/infoNoArgs';

import Error from './pages/error';
import Empty from "./pages/empty";
import Tips from './pages/tips';

import UserContext from "./pages/userContext";
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