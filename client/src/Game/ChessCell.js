import React from "react";

const ChessCell = ({name, piece, callBackPiece, selectedPiece, myColor}) => {
    const checkeredPattern = (piece.position + Math.floor(piece.position/8)) % 2 === 0 ? "white-square" : "black-square"

    const chessPieceDictionary = {
        white:{pawn:"♙", knight:"♘", bishop:"♗", rook:"♖", queen:"♕", king:"♔"},
        black:{pawn:"♟", knight:"♞", bishop:"♝", rook:"♜", queen:"♛", king:"♚"},
        noColor:{empty:""}
    }

    const option = selectedPiece.moves.includes(piece.position) ? "visible" : "invisible"
    
    const handleClick = () => {
        callBackPiece(piece)
    }
    return (
        <div onClick={handleClick} className={`chess-cell ${myColor} ${checkeredPattern}`}>
            <div name="options" className={option}></div>
            {chessPieceDictionary[piece.color][piece.name]}
        </div> 
    )
}

export default ChessCell