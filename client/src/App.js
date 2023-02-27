import './App.css';
import React,{useState} from "react"
import { Routes , Route, BrowserRouter as Router} from "react-router-dom"
import LoginForm from "./Login/LoginForm.js"
import HomePage from "./Home/HomePage.js"
import SignUp from "./SignUp/SignUp.js"
import NavBar from './NavBar/Navbar';
import GamePage from './Game/GamePage';

function App() {

  const [showNavbar, setShowNavbar] = useState(false)
  const updateShowBar = (boolean) => {
    setShowNavbar(boolean)
  }

  return (
    <Router>
      {/* <NavBar showNavbar={showNavbar}/> */}
      <Routes>
        <Route
          exact path="/"
          element={<LoginForm/>}
        />
        <Route
          exact path="/signup"
          element={<SignUp/>}
        />
        <Route
          exact path="/home"
          element={<HomePage setShowNavbar={updateShowBar}/>}
        />
        <Route
          exact path="/game"
          element={<GamePage/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
