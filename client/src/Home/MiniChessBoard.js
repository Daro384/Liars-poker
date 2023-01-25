import React from "react";

const MiniChessBoard = ({chessPosition, myColor}) => {

    if (!chessPosition || !myColor) return <></>

    const board = Array(64).fill("")

    //Unzipping chessPosition into pieces and positions
    const pieces = []
    const positions = []
    let currentNum = ""
    for (const character of chessPosition) {
        if ("prnbqkPRNBQK".includes(character)) {
            pieces.push(character)
            if (currentNum) positions.push(parseInt(currentNum))
            currentNum = ""
        }
        else {
            currentNum += character
        }
    }
    positions.push(parseInt(currentNum))

    const chessPieceDictionary = {
        P:"♙", N:"♘", B:"♗", R:"♖", Q:"♕", K:"♔", //black pieces
        p:"♟", n:"♞", b:"♝", r:"♜", q:"♛", k:"♚" //white pieces
    }

    for (let i in pieces) {
        board[positions[i]] = chessPieceDictionary[pieces[i]]
    }

    let squareIndex = 0

    const chessCells = board.map(cell => {
        const checkeredPattern = (squareIndex + Math.floor(squareIndex/8)) % 2 === 0 ? "white-square" : "black-square"
        squareIndex += 1
        return(
        <div 
            key={squareIndex}
            className={`${checkeredPattern} ${myColor}-side`}
            >{cell}
        </div>)
    })

    return (
        <>
            {chessCells}
        </>
    )
}

export default MiniChessBoard