import React from "react";
import ChessCell from "./ChessCell.js"

const ChessBoard = ({board, callBackPiece, selectedPiece, myColor}) => {
    const grid = board.map(cell => {
        return (
            <ChessCell 
                key={cell.position} 
                name={cell.name} 
                piece={cell} 
                callBackPiece={callBackPiece}
                selectedPiece={selectedPiece}
                myColor={myColor}
            />
        )
    })
            
    return (
        <div className={`chess-board ${myColor}`}>{grid}</div>
    )
}

export default ChessBoard