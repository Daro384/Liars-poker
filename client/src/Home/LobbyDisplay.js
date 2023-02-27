import React from "react";

//first participant is always host and therefore we can check and see if it matches my name to give privileges to the host
const LobbyDisplay = ({lobbyData, myId, handleStart, handleCancel, handleLeave}) => {

    let participants = []
    participants = lobbyData?.participants?.map(participant => participant.display_name)
    const lobbyName = lobbyData?.lobbyName
    const amIHost = (yesFunction, noFunction) => {
        return lobbyData?.player_id === myId ? yesFunction : noFunction
    }

    return (
        <div id="lobby-page">
            <h2>{lobbyName}</h2>

            {amIHost(
                <button onClick={handleCancel}>cancel</button>, //I'm host
                <button onClick={handleLeave}>leave</button> //I'm not
            )}

            <div id="player-holder">
                {
                participants?.map((player, index) => {
                    return <p key={index}>{`${index+1}. ${player}`}</p>
                })}
            </div>

            {amIHost( 
                <button onClick={handleStart}>Start</button>,
                <></>
            )}

        </div>
        
    )
}

export default LobbyDisplay
