import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"
const padlockImg = "https://i.imgur.com/A6nFgN9.png"
const userImg = "https://i.imgur.com/faQQJ5O.png"

const LoginForm = () => {
    const navigate = useNavigate()

    //controlled form for inputs
    const [formData, setFormData] = useState({username:"", password:""})

    //wrong password
    const [valid, setValid] = useState(true)

    const alert = valid ? 
    <></>
    : 
    <div className="alert">
        <p>Username or Password is incorrect</p>
    </div>
    const handleInputChange = event => {
        setFormData({...formData, [event.target.name]:event.target.value})
    }

    const handleSignup = () => {
        navigate("/signup")
    }

    const handleSubmit = event => {
        event.preventDefault()
        fetch("/login", {
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify(formData)
        })
        .then(resp => resp.json())
        .then(confirmation => {
            if (confirmation.error) setValid(false)
            else navigate("/home")
        })
    }   

    return (
        <div id="start-div">
            <h2 className="login title">APP TITLE</h2>
            <form onSubmit={handleSubmit}>
                {alert}
                <div id="username">
                    <div className="input-field">
                        <img src={userImg}/>
                        <input
                            className="login-details"
                            type="text"
                            name="username"
                            placeholder="Please enter your username"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                
                <div id="password">
                    <div className="input-field">
                        <img src={padlockImg}/>
                        <input 
                            className="login-details"
                            type="password"
                            name="password"
                            placeholder="Please enter your password"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                
                <br/>

                <input
                    id="login-button"
                    type="submit"
                    value="Log In"
                />
            </form>

            <div id="divider">
                    <div className="line left"></div>
                    <p>New?</p>
                    <div className="line right"></div>
            </div>
                
            <div id="new-user">
                <button onClick={handleSignup}>Sign up</button>
                <p>or</p>
                <button>Play as guest</button>
            </div>
        </div>

    )
}

export default LoginForm