import './App.css';
import React from "react"
import { Routes , Route, BrowserRouter as Router} from "react-router-dom"
import LoginForm from "./Login/LoginForm.js"
import HomePage from "./Home/HomePage.js"
import ChessPage from './Game/ChessPage'
import SignUp from "./SignUp/SignUp.js"

function App() {

  return (
    <Router>
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
          element={<HomePage/>}
        />
        <Route
          exact path="/game"
          element={<ChessPage/>}
        />
      </Routes>
    </Router>
  );
}

export default App;


// const handleClick = event => {
//   fetch("/login", {
//     method:"POST",
//     headers: {"Content-Type":"application/json"},
//     body: JSON.stringify({username:"daro2", password:"Hello"})
//   })
//   .then(resp => resp.json())
//   .then(console.log)
// } 
// const handleClick2 = event => {
//   fetch("/logout", {
//     method:"DELETE"
//   })
//   .then(resp => resp.json())
//   .then(console.log)
// } 
// const handleClick3 = event => {
//   fetch("/me")
//   .then(resp => resp.json())
//   .then(console.log)
// } 
// const handleClick4 = event => {
//   fetch("/users", {
//     method:"POST",
//     headers:{"Content-Type":"Application/json"},
//     body:JSON.stringify({username:"daro2", password:"Hello", display_name:"Joseph H", rating:1000})
//   })
//   .then(resp => resp.json())
//   .then(console.log)
// } 
