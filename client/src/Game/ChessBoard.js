import React from "react";
import ChessCell from "./ChessCell.js"

const ChessBoard = ({boardArray, setMoveOptions, moveOptions}) => {
    
    const grid = boardArray.map(cell => {
        return (
            <ChessCell 
                key={cell.position} 
                name={cell.name} 
                piece={cell} 
                moveOptions={moveOptions} 
                setMoveOptions={setMoveOptions} 
                board={boardArray}
            />
        )
    })
            
    return (
        <div className="chess-board">{grid}</div>
    )
}

export default ChessBoard