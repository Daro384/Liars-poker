import React from "react";

const ChessCell = ({name, piece, moveOptions, setMoveOptions, board}) => {
    
    const option = moveOptions.moves.includes(piece.position) ? "chess-option":"chess-cell"
    
    const handleClick = event => {
        if (moveOptions.moves.includes(piece.position)) {
            setMoveOptions({piece:"", moves:[]})
            moveOptions.piece.movePiece(board, piece.position)
            return 
        }
        else if (piece.name !== "empty") {
            return setMoveOptions({piece:piece, moves:piece.findMoves(board)})
        }
        else {
                return setMoveOptions({piece:"", moves:[]})
            }
    }
    

    return (
        <div onClick={handleClick} className={option}>
            {name}
        </div> 
    )
}

export default ChessCell