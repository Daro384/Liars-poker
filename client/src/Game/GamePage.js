import React,{useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import random from 'random'
import seedrandom from 'seedrandom'
import {bestHandSorter, translateMove, inputValid, prettyHand, validateHand} from './handLogic'
import "./Game.css"

import PlayerDiv from './playerDiv';
import CardFace from './CardFace';



const GamePage = () => {
    const {id} = useParams()

    const [me, setMe] = useState({})
    const [players, setPlayers] = useState([])
    const [move, setMove] = useState([])
    const [moves, setMoves] = useState([])
    const [handToBeat, setHandToBeat] = useState(undefined)
    const [turn, setTurn] = useState(0)
    const [showEnd, setShowEnd] = useState(false)
    const [loser, setLoser] = useState(null)
    const [randomSeed, setRandomSeed] = useState(0)

    //initialize some common state variables
    useEffect(() => {
        fetch("/me")
        .then(resp => resp.json())
        .then(setMe)
        fetch(`/games/${id}`)
        .then(resp => resp.json())
        .then(gamesData => {
            setRandomSeed(gamesData.rng_hash)
            setPlayers(gamesData.players)
        })
    },[])

    //poll for new moves
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetch(`/games/${id}`)
            .then(resp => resp.json())
            .then(
                gameData => {
                    setMoves(gameData.moves)
                    setHandToBeat(gameData.moves.slice(-1)[0]?.hand)
                    setTurn(gameData.moves.length)
                    if (gameData.ongoing === false) {
                        setShowEnd(true)
                        setLoser(gameData.loser)
                        clearInterval(intervalId)
                    }
                    
                }
            )
        }, 3000)
        return (() => clearInterval(intervalId))
        
    },[])

    //setting common variables
    const myIndex = players.findIndex(player => player.player_id === me.id)

    //generates 52 numbers that are then shuffled
    random.use(seedrandom(randomSeed))
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

    //rotate players so clients index is first (for display purposes)
    const rotatedPlayers = [...players.slice(myIndex + 1), ...players.slice(0, myIndex)]
    const playerDivs = rotatedPlayers.map((player,index) => {
        const thisIndex = players.findIndex(thisPlayer => thisPlayer.player_id === player.player_id)
        const thisToPlay = turn % players.length === thisIndex
        return (
            <PlayerDiv 
                key={player.id} 
                name={player.display_name} 
                position={index + 1} 
                handArray={shuffledNumberArray.slice(5*(thisIndex+1),5*(thisIndex+2))}
                show={showEnd}
                thisToPlay={thisToPlay}
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
        
        const alertString = "input invalid, input has to be of higher value then previous play and can't be more " +
        "than 5 character. Ace has to be written as 'A', King -> K, Queen -> Q, Jack -> J, 10 -> T (whitespace " +
        "and capitalization don't matter) Flush hands must be indicated with 'F' as the last character"
        event.preventDefault()
        if (!inputValid(move)) {
            alert(alertString)
            console.log("this ERRor")
            return
        }
        if (handToBeat) {
            if (bestHandSorter(translateMove(move), translateMove(handToBeat)) < 1) {
                alert(alertString)
                return
            }
        }

        fetch("/moves", {
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({
                game_id:id,
                player_id:me.id,
                hand:prettyHand(translateMove(move))
            })
        }).then(resp => resp.json())
        .then(newMove => {
            setHandToBeat(newMove.hand)
            setTurn(turn + 1)
        })

    } 

    const handleLieCall = event => {
        let updateBody
        if (validateHand(translateMove(handToBeat), shuffledNumberArray.slice(0, 5 * players.length + 5))) {
            updateBody = {
                loser:me.display_name,
                ongoing:false
            }
        } else {
            updateBody = {
                loser:rotatedPlayers.slice(-1)[0].display_name,
                ongoing:false
            }
        }
        fetch(`/games/${id}`, {
            method:"PATCH",
            headers:{"content-type":"application/json"},
            body:JSON.stringify(updateBody)
        }).then(
            fetch("/moves", {
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify({
                    game_id:id,
                    player_id:me.id,
                    hand:"LIAR!"
                })
            }).then(setShowEnd(true))
        )
        
    }

    const moveForm = (
        turn % players.length === myIndex && !showEnd ? 
        <form id={"hand-submit"} onSubmit={handleSubmit}>
            <label>Play a better hand</label>
            <br/>
            <input type="text" onChange={controlledForm}/>
            <input type="submit"/>
            <br/>
            <input type="button" value="Call Lie" onClick={handleLieCall}/>
        </form>
        :
        <></>
    )

    const endText = () => {
        if (true) {
            return `${loser} lost`
        } else {
            return `${loser} lost`
        }
    }
    // console.log(showEnd)

    const showingLoser = (
        showEnd ?
        <p id="end-text">{endText()}</p>
        :
        <></>
    )

    const moveHistory = moves.map((move,index) => {
        return <li key={index}>{`${players.find(player => player.player_id === move.player_id).display_name}: ${move.hand}`}</li>
    })



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
                <h1>{handToBeat?.split("")?.join(" ")}</h1>
            </div>

            <div id="my-hand">
                {myCards}
            </div>
            {moveForm}
            {showingLoser}
            <ol id="move-history">{moveHistory}</ol>
        </>
    )
}

export default GamePage