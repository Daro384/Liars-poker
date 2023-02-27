import React from "react";

const PlayerDiv = ({handArray, name, position}) => {
    return (
        <div className={`player-div position${position}`}>
            <p>Hello</p>
            <div className="opponent-playing-card"></div>
            <div className="opponent-playing-card"></div>
            <div className="opponent-playing-card"></div>
            <div className="opponent-playing-card"></div>
            <div className="opponent-playing-card"></div>
        </div>
    )
}

export default PlayerDiv