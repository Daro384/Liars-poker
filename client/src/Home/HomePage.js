import React,{useState, useEffect} from "react"
import { json, useNavigate } from "react-router-dom"
import "./Home.css"

import LobbyDisplay from "./LobbyDisplay"


const HomePage = ({setShowNavbar}) => {

    const navigate = useNavigate()
    setShowNavbar(true)

    const [me, setMe] = useState({id:null})
    const [showCreate, setShowCreate] = useState(false)
    const [gameName, setGameName] = useState("")
    const [hostedGames, setHostedGames] = useState([])

    const [selectedLobbyId, setSelectedLobbyId] = useState(null)
    const [lobbyData, setLobbyData] = useState({})
    
    useEffect(() => {
        let intervalId
        fetch("/me")
        .then(resp => resp.json())
        .then(mySession => {
            setMe(mySession)
            setGameName(mySession.username + "'s game")
            intervalId = setInterval(() => {
                fetch("/hosts")
                .then(resp => resp.json())
                .then(data => {
                    setHostedGames([...data])
                })
            }, 3000);
        })
        return clearInterval(intervalId)
    }, [])

    //updating lobby data every time we get host data and route to game page when ever game is created
    useEffect(() => {
        if (selectedLobbyId) {
            setLobbyData(hostedGames.find(hostData => selectedLobbyId === hostData.id))
        }

        fetch("/games")
        .then(resp => resp.json())
        .then(games => {
            if (games.find(game => (game.host_id === selectedLobbyId))) {
                //route to game page
            }
        })
    },[hostedGames])

    const onSubmitLobby = (event) => {
        event.preventDefault()
        fetch(`/hosts`, {
            method:"POST",
            headers: {"content-type":"application/json"},
            body: JSON.stringify({
                    player_id:me.id, 
                    lobby_name:gameName, 
                    rng_seed:Math.random()
                })
        }).then(resp => resp.json())
        .then(host => {
            setShowCreate(false)
            setSelectedLobbyId(host.id)
            fetch(`/participants`, {
                method:"POST",
                headers: {"content-type":"application/json"},
                body: JSON.stringify({
                    host_id:host.id,
                    player_id:me.id, 
                    display_name:me.display_name
                })
            }).then(resp => resp.json())
            .then(console.log)
        })

        
    }

    const HostGameSetup = (
        showCreate ? 
        <div id="host-create-page">
            <form>
                <label>Lobby Name: </label>
                <input type="text" value={gameName} onChange={(event) => setGameName(event.target.value)}/>
                <input type="submit" value="Host Lobby" className="submitter" onClick={onSubmitLobby}/>
            </form>
            <div id="exit-button" onClick={() => setShowCreate(false)}>X</div>
            
        </div>
        : 
        <></>
    )

    const handleCancel = event => {
        fetch(`/hosts/${lobbyData.id}`, {method:"DELETE"})
        .then(setSelectedLobbyId(null))
    } 
    
    const handleLeave = event => {
        fetch(`/participants/${me.id}`, {method:"DELETE"})
        .then(setSelectedLobbyId(null))
    }

    const handleStart = event => {

        const gameBody = {
            lobby_name:gameName,
            ongoing:true,
            rng_hash:null,
            host_id:lobbyData.id
        }
        
        const playerBody = {
            player_id:me.id,
            display_name:me.display_name,
            game_id:lobbyData.id
        }

        fetch("/games", {
            method:"post",
            headers: {"content-type":"application/json"},
            body:JSON.stringify(gameBody)
        })
        .then(resp => resp.json())
        .then(gameData => {
            fetch("/players", {
                method:"post",
                headers: {"content-type":"application/json"},
                body:JSON.stringify(playerBody)
            })
        }).then(
            //route to game page
        )
    }

    const handleJoin = event => {
        setSelectedLobbyId(parseInt(event.target.value))

        fetch(`/participants`, {
            method:"POST",
            headers: {"content-type":"application/json"},
            body: JSON.stringify({
                host_id:event.target.value,
                player_id:me.id, 
                display_name:me.display_name
            })
        }).then(resp => resp.json())
    }

    const HostCards = hostData => {
        return (
        <div className="host-card" key={hostData.id}>
            <h3>{hostData.lobby_name}</h3>
            <p>{hostData.participants.length + "/4 players"}</p>
            <button value={hostData.id} onClick={handleJoin}>Join</button>
        </div>
        )
    }


    const showHostedGames = hostedGames.map(hostData => {
        if (hostData.player_id === me.id) return
        else return HostCards(hostData)
    })

    const lobbyDisplay = selectedLobbyId ? 
        <LobbyDisplay 
            lobbyData={lobbyData}
            myId={me.id}
            handleStart={handleStart} 
            handleCancel={handleCancel} 
            handleLeave={handleLeave}
        /> 
        : <></>

    return (
        <>
            <div id="main-holder">
                <div id="host-button" onClick={() => setShowCreate(!showCreate)}>Host</div>

                <div id="games">
                    <div id="game-lobby">
                    {showHostedGames}
                    </div>

                    <div id="active-games">
                    </div>
                </div>

                
            </div>
            <div>{HostGameSetup}</div>
            {lobbyDisplay}
        </>
    )
}

export default HomePage