import React,{useState} from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const navigate = useNavigate()

    //controlled form for inputs
    const [formData, setFormData] = useState({username:"", password:""})

    const handleInputChange = event => {
        setFormData({...formData, [event.target.name]:event.target.value})
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
            if (confirmation.error) console.log("alert the user that they entered wrong username or password")
            else navigate("/home")
        })
    }   

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Please enter your username"
                onChange={handleInputChange}
            />
            <br/>
            <input 
                type="password"
                name="password"
                placeholder="Please enter your password"
                onChange={handleInputChange}
            />
            <input
                type="submit"
                value="Submit"
            />
        </form>
    )
}

export default LoginForm