import React from "react";

const CardFace = ({cardIndex, show, position}) => {
    
    const suitArray = ["♠", "♥", "♣", "♦"]
    const cardArray = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
    const suit = suitArray[Math.floor(cardIndex / 13)]
    const card = cardArray[cardIndex % 13] 
    const color = Math.floor(cardIndex / 13) % 2 === 0 ? "black" : "red"

    return show ? (
        <div className="card-face">
            <p className={`top color-${color}`}>{`${card}${suit}`}</p>
            <h1 className={`center color-${color}`}>{`${card}${suit}`}</h1>
            <p className={`bottom color-${color}`}>{`${card}${suit}`}</p>
        </div>
    ) 
    :
    (
        <div id="card-back">
        </div>
    )
}

export default CardFace