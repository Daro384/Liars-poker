import React,{useState, useEffect} from "react";
import ChessBoard from "./ChessBoard";

const ChessPage = ({}) => {

    const initializeBoard = [...Array(64).keys()].map(square => {
        return {position:square, name:"empty", color:""}
    })
    const [board, setBoard] = useState(initializeBoard)
    


    useEffect(() => {
        const allPieces = [
            new Pawn("pawn", 8, "white"), new Pawn("pawn", 9, "white"), new Pawn("pawn", 10, "white"), new Pawn("pawn", 11, "white"), 
            new Pawn("pawn", 12, "white"), new Pawn("pawn", 13, "white"), new Pawn("pawn", 14, "white"), new Pawn("pawn", 15, "white"), 
            new Pawn("pawn", 48, "black"), new Pawn("pawn", 49, "black"), new Pawn("pawn", 50, "black"), new Pawn("pawn", 51, "black"), 
            new Pawn("pawn", 52, "black"), new Pawn("pawn", 53, "black"), new Pawn("pawn", 54, "black"), new Pawn("pawn", 55, "black"), 
            new Rook("rook", 0, "white"), new Rook("rook", 7, "white"), new Rook("rook", 56, "black"), new Rook("rook", 63, "black"),
            new Knight("knight", 1, "white"), new Knight("knight", 6, "white"), new Knight("knight", 57, "black"), new Knight("knight", 62, "black"),
            new Bishop("bishop", 2, "white"), new Bishop("bishop", 5, "white"), new Bishop("bishop", 58, "black"), new Bishop("bishop", 61, "black"),
            new King("king", 3, "white"), new Queen("queen", 4, "white"), new King("king", 59, "black"), new Queen("queen", 60, "black"),
        ]
        const boardArray = [...board]
        allPieces.forEach(item => {
            boardArray[item.position] = item
        })
        setBoard(boardArray)
    },[])

    class ChessPiece {
        constructor(name, position, color) {
            this.name = name
            this.position = position
            this.color = color
            this.firstMove = true
        }

        outOfBounds(column, row) {
            if (column < 0 || column > 7) return true
            else if (row < 0 || row > 7) return true
            else return false
        }

        allyPiece(position_index, myColor, board) {
            return board[position_index].color === myColor ? true : false
        }

        opponentPiece(position_index, myColor, board) {
            const opponentColor = myColor === "white" ? "black" : "white"
            return board[position_index].color === opponentColor ? true : false
        }

        movePiece(board, position) {
            const newBoard = [...board]
            newBoard[this.position] = {position:this.position, name:"empty", color:""}
            this.position = position
            newBoard[position] = this
            this.firstMove = false
            setBoard(newBoard)
        }

        indexToCoordinates(positionIndex) { //takes the index and spits out a coordinate in [#column, #row] form
            const row = Math.floor(positionIndex / 8)
            const column = positionIndex % 8
            return [column, row] 
        }

        coordinateToIndex(column, row) { //takes a coordinate and turns it into a index for the board. 
            return 8 * row + column
        }
    }

    class Pawn extends ChessPiece {
        findMoves(board){
            const moves = []
            const thisPositionCoordinate = this.indexToCoordinates(this.position)
            const moveTranslationVector = this.color === "white" ? [0,1] : [0,-1]
            const captureTranslationVectors = this.color === "white" ? [[1,1],[-1,1]] : [[1,-1],[-1,-1]]

            const range = this.firstMove ? 2 : 1

            let potentialMove = [thisPositionCoordinate[0] + moveTranslationVector[0], thisPositionCoordinate[1] + moveTranslationVector[1]]
            for (let i = 0; i < range; i++) {
                const potentialMoveIndex = this.coordinateToIndex(...potentialMove)
                if (this.outOfBounds(...potentialMove)) break
                else if (this.allyPiece(potentialMoveIndex, this.color, board)) break
                else if (this.opponentPiece(potentialMoveIndex, this.color, board)) break
                else moves.push(this.coordinateToIndex(...potentialMove))
                potentialMove = [potentialMove[0] + moveTranslationVector[0], potentialMove[1] + moveTranslationVector[1]]
            }
            captureTranslationVectors.forEach(translation => {
                potentialMove = [thisPositionCoordinate[0] + translation[0], thisPositionCoordinate[1] + translation[1]]
                const potentialMoveIndex = this.coordinateToIndex(...potentialMove)
                if (this.outOfBounds(...potentialMove)) return
                else if (this.allyPiece(potentialMoveIndex, this.color, board)) return
                else if (this.opponentPiece(potentialMoveIndex, this.color, board)) {
                    moves.push(this.coordinateToIndex(...potentialMove))
                }
            })
            return moves
            
        }
        
    }

    class Rook extends ChessPiece {
        findMoves(board) {
            const moves = []
            const thisPositionCoordinate = this.indexToCoordinates(this.position)
            const translationVectors = [[0,1], [0,-1], [1,0], [-1,0]]
            translationVectors.forEach((translation) => {
                let potentialMove = [thisPositionCoordinate[0] + translation[0], thisPositionCoordinate[1] + translation[1]]
                let obstacle = false
                while (!obstacle) {
                    const potentialMoveIndex = this.coordinateToIndex(...potentialMove)

                    if (this.outOfBounds(...potentialMove)) obstacle = true
                    else if (this.allyPiece(potentialMoveIndex, this.color, board)) obstacle = true
                    else if (this.opponentPiece(potentialMoveIndex, this.color, board)) {
                        obstacle = true
                        moves.push(this.coordinateToIndex(...potentialMove))
                    }
                    else moves.push(this.coordinateToIndex(...potentialMove))
                    potentialMove = [potentialMove[0] + translation[0], potentialMove[1] + translation[1]]
                    
                }
            })
            return moves
        }
    }

    class Knight extends ChessPiece {
        findMoves(board) {
            const thisPositionCoordinate = this.indexToCoordinates(this.position)
            const relativeKnightMoves = [[-2,1], [-1,2], [1,2], [2,1], [2,-1], [1,-2], [-1,-2], [-2,-1]]

            const knightMoves = relativeKnightMoves.map(move => {
                return [move[0] + thisPositionCoordinate[0], move[1] + thisPositionCoordinate[1]]
            })
            const moves = knightMoves.filter(move => {
                const moveIndex = this.coordinateToIndex(...move)
                let valid = true
                if (this.outOfBounds(...move)) {valid = false}
                else if (this.allyPiece(moveIndex, this.color, board)) {valid = false}
                return valid
            })
                
            return moves.map(move => this.coordinateToIndex(...move))
        }
    }

    class Bishop extends ChessPiece {
        findMoves(board) {
            const thisPositionCoordinate = this.indexToCoordinates(this.position)
            const moves = []
            const translationVectors = [[1,1], [1,-1], [-1,1], [-1,-1]]
            translationVectors.forEach((translation) => {
                let potentialMove = [thisPositionCoordinate[0] + translation[0], thisPositionCoordinate[1] + translation[1]]
                let obstacle = false
                while (!obstacle) {
                    const potentialMoveIndex = this.coordinateToIndex(...potentialMove)

                    if (this.outOfBounds(...potentialMove)) obstacle = true
                    else if (this.allyPiece(potentialMoveIndex, this.color, board)) obstacle = true
                    else if (this.opponentPiece(potentialMoveIndex, this.color, board)) {
                        obstacle = true
                        moves.push(this.coordinateToIndex(...potentialMove))
                    }
                    else moves.push(this.coordinateToIndex(...potentialMove))
                    potentialMove = [potentialMove[0] + translation[0], potentialMove[1] + translation[1]]
                    
                }
            })
            return moves
        }   
    }

    class Queen extends ChessPiece {
        findMoves(board) {
            const thisPositionCoordinate = this.indexToCoordinates(this.position)
            const moves = []
            const translationVectors = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]]
            translationVectors.forEach((translation) => {
                let potentialMove = [thisPositionCoordinate[0] + translation[0], thisPositionCoordinate[1] + translation[1]]
                let obstacle = false
                while (!obstacle) {
                    const potentialMoveIndex = this.coordinateToIndex(...potentialMove)

                    if (this.outOfBounds(...potentialMove)) obstacle = true
                    else if (this.allyPiece(potentialMoveIndex, this.color, board)) obstacle = true
                    else if (this.opponentPiece(potentialMoveIndex, this.color, board)) {
                        obstacle = true
                        moves.push(this.coordinateToIndex(...potentialMove))
                    }
                    else moves.push(this.coordinateToIndex(...potentialMove))
                    potentialMove = [potentialMove[0] + translation[0], potentialMove[1] + translation[1]]
                    
                }
            })
            return moves
        }
    }

    class King extends ChessPiece {
        findMoves(board) {
            const thisPositionCoordinate = this.indexToCoordinates(this.position)
            const moves = []
            const translationVectors = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]]
            translationVectors.forEach((translation) => {
                let potentialMove = [thisPositionCoordinate[0] + translation[0], thisPositionCoordinate[1] + translation[1]]
                const potentialMoveIndex = this.coordinateToIndex(...potentialMove)

                if (this.outOfBounds(...potentialMove)) return
                else if (this.allyPiece(potentialMoveIndex, this.color, board)) return
                else if (this.opponentPiece(potentialMoveIndex, this.color, board)) {
                    moves.push(this.coordinateToIndex(...potentialMove))
                }
                else moves.push(this.coordinateToIndex(...potentialMove))
                    
                }
            )
            return moves
        }
        
    }

    const [selectedPiece, setSelectedPiece] = useState({piece:"", moves:[]})

    return (
        <ChessBoard 
            boardArray={board} 
            moveOptions={selectedPiece} 
            setMoveOptions={setSelectedPiece}
        />
    )
}

export default ChessPage