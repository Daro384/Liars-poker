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
    const [disableJoin, setDisableJoin] = useState(false)

    const [selectedLobbyId, setSelectedLobbyId] = useState(null)
    const [lobbyData, setLobbyData] = useState({})
    
    useEffect(() => {
        let intervalId
        fetch("/me")
        .then(resp => resp.json())
        .then(mySession => {
            setMe(mySession)
            setGameName(mySession.display_name + "'s game")
            intervalId = setInterval(() => {
                fetch("/hosts")
                .then(resp => resp.json())
                .then(data => {
                    setHostedGames([...data])
                })
            }, 3000);
        })
        return () => clearInterval(intervalId)
    }, [])

    //updating lobby data every time we get host data and route to game page when ever game is created
    useEffect(() => {
        if (selectedLobbyId) {
            setLobbyData(hostedGames.find(hostData => selectedLobbyId === hostData.id))

            fetch("/games")
            .then(resp => resp.json())
            .then(games => {
                let gameId
                if (games.find(game => {
                    gameId = game.id
                    return (game.host_id === selectedLobbyId)
                })) navigate(`/game/${gameId}`)
            })
        }
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
        setDisableJoin(false)
        fetch(`/participants/${me.id}`, {method:"DELETE"})
        .then(setSelectedLobbyId(null))
    }
    const handleStart = event => {
        const gameBody = {
            lobby_name:gameName,
            ongoing:true,
            rng_hash:lobbyData.rng_seed,
            host_id:lobbyData.id
        }
        let gameId
        const promiseList = []
        fetch("/games", {
            method:"post",
            headers: {"content-type":"application/json"},
            body:JSON.stringify(gameBody)
        })
        .then(resp => resp.json())
        .then(gameData => {
            gameId = gameData.id
            lobbyData.participants.forEach(participant => {
                promiseList.push(fetch("/players", {
                    method:"post",
                    headers: {"content-type":"application/json"},
                    body:JSON.stringify(
                        {
                            player_id:participant.player_id,
                            display_name:participant.display_name,
                            game_id:gameId
                        }
                    )
                }))
            })  
            Promise.all(promiseList).then(
                fetch(`/hosts/${selectedLobbyId}`, {method:'DELETE'}).then(
                    navigate(`/game/${gameId}`)
                )
            )  
        })
    }

    const handleJoin = event => {
        setSelectedLobbyId(parseInt(event.target.value))
        setDisableJoin(true)

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
            <button value={hostData.id} onClick={handleJoin} disabled={disableJoin}>Join</button>
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
                <div id="host-button" onClick={() => setShowCreate(!showCreate)}>Create a Lobby</div>

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