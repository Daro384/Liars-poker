import React,{useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import random from 'random'
import seedrandom from 'seedrandom'
import "./Game.css"

import PlayerDiv from './playerDiv';
import CardFace from './CardFace';



const GamePage = () => {
    const {id} = useParams()

    const [me, setMe] = useState({})
    const [players, setPlayers] = useState([])
    const [move, setMove] = useState([])

    useEffect(() => {
        fetch("/me")
        .then(resp => resp.json())
        .then(setMe)

        fetch(`/games/${id}`)
        .then(resp => resp.json())
        .then(gamesData => {
            setPlayers(gamesData.players)
        })
    },[])

    

    random.use(seedrandom(2))

    //generates 52 numbers that are then shuffled
    const numberArray = Array.from(Array(52).keys())
    const shuffledNumberArray = []
    for (let i = 0;  i < 52;  i++) {
        const randomChoice = random.choice(numberArray)
        shuffledNumberArray.push(...numberArray.splice(numberArray.indexOf(randomChoice), 1))
    }

    const communityCards = shuffledNumberArray.slice(0,5).map(element => {
        return (
        <div key={element} className='community-card'>
            <CardFace cardIndex={element} show={true}/>
        </div>
        )
    })

    //rotate players so I'm in the first index
    const myIndex = players.findIndex(player => player.player_id === me.id)
    const rotatedPlayers = [...players.slice(myIndex + 1), ...players.slice(0, myIndex)]
    const playerDivs = rotatedPlayers.map((player,index) => {
        const thisIndex = players.findIndex(thisPlayer => thisPlayer.player_id === player.player_id)
        return (
            <PlayerDiv 
                key={player.id} 
                name={player.display_name} 
                position={index + 1} 
                handArray={shuffledNumberArray.slice(5*(thisIndex+1),5*(thisIndex+2))}
                show={false}
            />
        )
    })

    const myCards = shuffledNumberArray.slice((myIndex+1)*5, (myIndex+2)*5).map(cardIndex => {
        return (
            <div key={cardIndex} className='my-card'>
                    <CardFace cardIndex={cardIndex} show={true}/>
            </div>
        )
    })

    const controlledForm = event => {
        setMove(event.target.value) 
    }

    const handleSubmit = event => {
        event.preventDefault()
        console.log("does nothing")
    } 

    return (
        <>
            <div id="play-area">
                {playerDivs}
            </div>

            <div id='community-card-holder'>
                {communityCards}
            </div>

            <div id="hand-to-beat">
                <p>Hand to beat:</p>
                <h1>{"A K Q J T"}</h1>
            </div>

            <div id="my-hand">
                {myCards}
            </div>

            <form id={"hand-submit"} onSubmit={handleSubmit}>
                <label>Play a better hand</label>
                <br/>
                <input type="text" onChange={controlledForm}/>
                <input type="submit"/>
            </form>
        </>
    )
}

export default GamePage