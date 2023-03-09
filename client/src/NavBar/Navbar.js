import React,{useState,useEffect} from "react";
import {useNavigate} from "react-router-dom"
import "./Nav.css"

const NavBar = ({}) => {
    const navigate = useNavigate()

    const [inSession, setInSession] = useState(false)

    useEffect(() => {
        fetch("/me")
        .then(resp => resp.json())
        .then(sessionResponse => {
            if (!sessionResponse.error) {
                setInSession(true)
            }
            else {
                navigate("/")
                setInSession(false)
            }
        })
    }, [])
    
    
    const handleOnHome = () => {
        navigate("/home")
    }
    
    const handleOnLogout = () => {
        fetch("/logout", {method:"DELETE"})
        .then(() => {
            setInSession(false)
            navigate("/")
        })
    }
    
    const showNavBar = inSession ? 
        <div id="nav">
            <div onClick={handleOnHome}>Home</div>
            <div onClick={handleOnLogout}>Log Out</div>
        </div>
        :
        <></>
    return (
        <>
            {showNavBar}
        </>
    )
}

export default NavBar
