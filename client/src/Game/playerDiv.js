import React from "react";
import CardFace from "./CardFace";

const PlayerDiv = ({handArray, name, position, show, thisToPlay}) => {

    const indicateTurn = thisToPlay ? "bold" : ""

    const opponentCards = handArray.map(cardIndex => {
        return (
            <div key={cardIndex} className="opponent-playing-card">
                <CardFace cardIndex={cardIndex} show={show}/>
            </div>
        )
    })

    return (
        <div className={`player-div position${position}`}>
            <p className={`player-name ${indicateTurn}`}>{name}</p>
            {opponentCards}
        </div>
    )
}

export default PlayerDiv