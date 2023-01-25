import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css"



const SignUp = () => {

    const navigate = useNavigate()

    const [displayName, setDisplayName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [taken, setTaken] = useState(false)
    const [emptyField, setEmptyField] = useState(false)

    const valid = password => { //returns true if password is valid and false if it ain't
        const validCharacters = /[a-zA-Z0-9!()-.?_':;!@#$%^&*+=]{8,20}/
        const specialRequirement = /[0-9!()-.?_':;!@#$%^&*+=]+/
        const validLength = !!(password.length >= 8 && password.length <= 20)

        const characters = validCharacters.exec(password)
        const special = specialRequirement.exec(password)
        if (characters && special && validLength) {
            if (characters[0] === characters.input) return true
        }
        else return false
    }

    const handleSignup = event => {
        event.preventDefault()
        if (!displayName.length || !username.length || !password.length) { //making sure none of the inputs are blank
            setEmptyField(true)
        } 
        else if (valid(password)) {
            setEmptyField(false)
            console.log({username:username, display_name:displayName, password:password, rating:800})
            fetch("/users", {
                method: "POST",
                headers: {"content-type":"application/json"},
                body: JSON.stringify({username:username, display_name:displayName, password:password, rating:800})
            }).then(resp => resp.json())
            .then(newUser => {
                console.log(newUser)
                if (newUser.errors?.[0] === "Username has already been taken") setTaken(true)
                else navigate("/")
            })
        } else setEmptyField(true)
    }

    const showPasswordHelp = valid(password) || 0 === password.length ? <></> : <p className="help-text">Your password has to have 8-20 characters with at least 1 number or special character.</p>
    const showTaken = taken ? <p className="help-text">This username is already taken</p> : <></>
    const showEmpty = emptyField ? <p className="help-text">Can't leave a field empty</p> : <></>

    return (
    <div id="sign-up-div">
        <h2 className="login title">SOLID CHESS</h2>
        <form>
            <div className="input-field">
                <label>Display Name</label>
                <br/>
                <input
                    placeholder="Display Name"
                    type="text"
                    onChange={event => setDisplayName(event.target.value)}
                />
            </div>

            <div className="input-field">
                <label>Username</label>
                <br/>
                <input
                    placeholder="Username"
                    type="text"
                    onChange={event => setUsername(event.target.value)}
                />
                {showTaken}
            </div>

            <div className="input-field">
                <label>Password</label>
                <br/>
                <input
                    placeholder="Password"
                    type="password"
                    onChange={event => setPassword(event.target.value)}
                />
                {showPasswordHelp}
            </div>

            <br/>
            <input
                id="sign-up-button"
                value="Sign Up"
                type="submit"
                onClick={handleSignup}
                />
            {showEmpty}
        </form>

        <div className="divider">
            <p>Already have an account?</p>
            <div className="line2 left"></div>
            <div className="line2 right"></div>
        </div>

        <button
            className="login"
            onClick={() => navigate("/")}
        >
        Login
        </button>
        
    </div>
    )
}

export default SignUp