import React,{useState,useEffect} from "react";
import {useNavigate} from "react-router-dom"
import "./Nav.css"

const NavBar = ({showNavbar}) => {
    const navigate = useNavigate()

    const [inSession, setInSession] = useState(false)
    const [myId, setMyId] = useState(null)
    const [inGame, setInGame] = useState(false)

    
    useEffect(() => {
        fetch("/me")
        .then(resp => resp.json())
        .then(sessionResponse => {
            if (!sessionResponse.error) {
                setInSession(true)
                fetch("/games")
                .then(resp => resp.json())
                .then(gameData => {
                    gameData.find(game => [game.white_player_id, game.black_player_id].includes(sessionResponse.id)) ? setInGame(true) : setInGame(false)
                })
            }
            else {
                navigate("/")
                setInSession(false)
            }
        })
    }, [showNavbar])
    
    
    const handleOnHome = () => {
        navigate("/home")
    }
    
    const handleOnGame = () => {
        navigate("/game")
    }
    
    const handleOnLogout = () => {
        fetch("/logout", {method:"DELETE"})
        .then(() => {
            setInSession(false)
            navigate("/")
        })
    }

    const inActiveGame = inGame ? <div onClick={handleOnGame}>Active Game</div> : <></>
    
    const showNavBar = inSession ? 
        <div id="nav">
            <div onClick={handleOnHome}>Home</div>
            {inActiveGame}
            <div>Recent Games</div>
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
