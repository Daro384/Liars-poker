import random from 'random'
import seedrandom from 'seedrandom'
import "./Game.css"
import React from "react";

import PlayerDiv from './playerDiv';



const GamePage = () => {

    random.use(seedrandom(1))

    //generates 52 numbers that are then shuffled
    const numberArray = Array.from(Array(52).keys())
    const shuffledNumberArray = []
    for (let i = 0;  i < 52;  i++) {
        const randomChoice = random.choice(numberArray)
        shuffledNumberArray.push(...numberArray.splice(numberArray.indexOf(randomChoice), 1))
    }
    console.log(shuffledNumberArray)

    // const opponentDivs = ["Daro", "Alex", "John"].map()

    return (
        <>
            <div id="play-area">
                <PlayerDiv name={"John"} position={1} turn={true}/> 
                <PlayerDiv name={"Alex"} position={2} turn={true}/> 
                <PlayerDiv name={"John-Paul"} position={3} turn={true}/> 
            </div>

            <div id='community-card-holder'>
                <div className='community-card'></div>
                <div className='community-card'></div>
                <div className='community-card'></div>
                <div className='community-card'></div>
                <div className='community-card'></div>
            </div>

            <div id="hand-to-beat">
                <p>Hand to beat:</p>
                <h1>{"A K Q J T"}</h1>
            </div>
        </>
    )
}

export default GamePage