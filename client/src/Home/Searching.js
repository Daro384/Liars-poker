import React,{useEffect} from "react"
import { useNavigate } from "react-router-dom"

const Searching = ({search, setSearch, me, timeControls}) => {

    const navigate = useNavigate()

    const handleCancel = () => {
        setSearch(false)
    }

    useEffect(() => {
        setSearch(true)
        let intervalID
        let myLobbyID

        fetch("/waitrooms")
        .then(resp => resp.json())
        .then(openGames => {
            const gameFound = openGames.find(user => !user.opponent)
            if (gameFound) {
                console.log("Game found")
                fetch(`/waitrooms/${gameFound.id}`, {
                    method:"PATCH",
                    headers: {"Content-type":"Application/json"},
                    body: JSON.stringify({opponent:me.id})
                })
                .then(resp => resp.json())
                .then(updateResponse => {
                    console.log(updateResponse)
                    //start waiting for the game to get created
                    intervalID = setInterval(() => {
                        fetch("/games")
                        .then(resp => resp.json())
                        .then(allGames => {
                            const myGame = allGames.find(game => game.ongoing && game.black_player_id === me.id)
                            if (myGame) navigate("/game")
                        })
                    },1000)

                })
            }
            else {
                console.log("No game found, Hosting my own game")
                fetch("/waitrooms", {
                    method: "POST", 
                    headers: {"content-type":"application/json"},
                    body: JSON.stringify({player_id:me.id, rating:me.rating, opponent:null, time:timeControls[0], time_increment:timeControls[1]})
                })
                .then(resp => resp.json())
                .then(myRoom => {
                    myLobbyID = myRoom.id 
                    intervalID = setInterval(() => {
                        fetch(`/waitrooms/${myRoom.id}`)
                        .then(resp => resp.json())
                        .then(myLobby => {
                            console.log(myLobby)
                            if (myLobby.opponent) {
                                clearInterval(intervalID)
                                fetch("/games", {
                                    method:"POST",
                                    headers:{"content-type":"Application/json"},
                                    body:JSON.stringify({
                                        white_player_id: me.id, 
                                        black_player_id: myLobby.opponent, 
                                        winner: null, 
                                        ongoing: true, 
                                        latest_position: null, 
                                        end_cause: null, 
                                        time: timeControls[0], 
                                        increment_time: timeControls[1]
                                    })
                                }).then(resp => resp.json())
                                .then(newGame => {
                                    console.log(newGame)
                                    navigate("/game")
                                })
                            }
                        })
                    }, 5000)
                })
            }
        })

        return () => {
            clearInterval(intervalID)
            fetch(`/waitrooms/${myLobbyID}`, {method:"DELETE"})
        }
    }
    ,[])

    return (
        <div>
            Searching for other players...
            <button onClick={handleCancel}>Cancel</button>
        </div>
    )
}

export default Searching