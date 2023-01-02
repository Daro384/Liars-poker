import React,{useState, useEffect} from "react";
import ChessBoard from "./ChessBoard";

const ChessPage = ({}) => {

    const initializeBoard = [...Array(64).keys()].map(square => {
        return {position:square, name:"empty", color:"noColor"}
    })
    const [board, setBoard] = useState(initializeBoard)
    const [ply, setPly] = useState(0)
    const [allPieces, setPieces] = useState([])
    const [selectedPiece, setSelectedPiece] = useState({piece:"", moves:[]})
    const [myId, setMyId] = useState(null)
    const [gameStats, setGameStats] = useState({gameId:null, myColor:null, myId:null})
    const [endText, setEndText] = useState("")

    useEffect(() => {
        fetch("/me").then(resp => resp.json())
        .then(data => setMyId(data.id))
    },[])

    useEffect(() => {
        if (myId){
            fetch("/games")
            .then(resp => resp.json())
            .then(games => {
                const myGame = games.find(game => {
                    return game.ongoing === true && (game.black_player_id === myId || game.white_player_id === myId)
                })
                
                if (myGame) {
                    const myColor = myGame.white_player_id === myId ? "white" : "black"
                    setGameStats({gameId:myGame.id, myColor:myColor, myId:myId})
                    let newBoard = board
                    myGame.plies.forEach(ply => {
                        const [piecePosition, move] = MoveNotationToIndex(ply.move)
                        newBoard = newBoard[piecePosition].movePiece(newBoard, move)
                    })
                    setBoard(newBoard)
                    setPly(ply + myGame.plies.length)
                }
                
            })
        }
        
    },[myId])

    const getLatestPly = () => {
        fetch(`games/${gameStats.gameId}`).then(resp => resp.json())
        .then(game => {
            if (game.plies.length > ply) {
                let i = 0
                let newBoard = board
                game.plies.slice(ply).forEach(newPly => {
                    const [piecePosition, move] = MoveNotationToIndex(newPly.move)
                    newBoard = newBoard[piecePosition].movePiece(newBoard, move)
                    i += 1
                })
                setBoard(newBoard)
                setPly(ply + i)
            }
        })
    }

    useEffect(() => {
        const colorTurn = ply % 2 !== 0 ? "white" : "black"
        let intervalId
        if (colorTurn === gameStats.myColor) {
            intervalId = setInterval(getLatestPly,1000)
        }
        return () => {
            clearInterval(intervalId)
        }

    }, [ply])
    

    useEffect(() => {
        const allPieces = {
            pawns:
            [
                new Pawn("pawn", 8, "white"), new Pawn("pawn", 9, "white"), new Pawn("pawn", 10, "white"), new Pawn("pawn", 11, "white"), 
                new Pawn("pawn", 12, "white"), new Pawn("pawn", 13, "white"), new Pawn("pawn", 14, "white"), new Pawn("pawn", 15, "white"), 
                new Pawn("pawn", 48, "black"), new Pawn("pawn", 49, "black"), new Pawn("pawn", 50, "black"), new Pawn("pawn", 51, "black"), 
                new Pawn("pawn", 52, "black"), new Pawn("pawn", 53, "black"), new Pawn("pawn", 54, "black"), new Pawn("pawn", 55, "black")
            ],
            rooks:[new Rook("rook", 0, "white"), new Rook("rook", 7, "white"), new Rook("rook", 56, "black"), new Rook("rook", 63, "black")],
            knights:[new Knight("knight", 1, "white"), new Knight("knight", 6, "white"), new Knight("knight", 57, "black"), new Knight("knight", 62, "black")],
            bishops:[new Bishop("bishop", 2, "white"), new Bishop("bishop", 5, "white"), new Bishop("bishop", 58, "black"), new Bishop("bishop", 61, "black")],
            kings:[new King("king", 3, "white"), new King("king", 59, "black")], 
            queens:[new Queen("queen", 4, "white"), new Queen("queen", 60, "black")]
        }
        setPieces(allPieces)

        Object.values(allPieces).flat().forEach(item => {
            if (item.position !== null) board[item.position] = item
        })

        setBoard([...board])
        
    },[])

    class ChessPiece {
        constructor(name, position, color) {
            this.name = name
            this.position = position
            this.color = color
            this.firstMove = true
            this.opponentColor = color === "white" ? "black" : "white"
            this.captured = false
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
            newBoard[this.position] = {position:this.position, name:"empty", color:"noColor"}
            this.position = position
            if (board[position].name !== "empty"){
                const capturedPiece = board[position]
                capturedPiece.captured = true
                capturedPiece.position = null
            }
            newBoard[position] = this
            this.firstMove = false
            return newBoard
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

    ///////////////////////////////////////////////////defining pieces//////////////////////////////////////////////

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

        isCheckedByPiece (board, threatPiece, range, translationVectors) {
            let checked = false
            const kingCoordinate = this.indexToCoordinates(this.position)

            translationVectors.forEach(translation => {
                let threatCoordinate = [kingCoordinate[0] + translation[0], kingCoordinate[1] + translation[1]]
                for (let i = 0; i < range; i++) {
                    if (this.outOfBounds(...threatCoordinate)) break
                    const threatPosition = this.coordinateToIndex(...threatCoordinate)
                    if (this.allyPiece(threatPosition, this.color, board)) break
                    if (threatPiece === board[threatPosition].name && board[threatPosition].color === this.opponentColor) {
                        checked = true
                        break
                    }
                    threatCoordinate = [threatCoordinate[0] + translation[0], threatCoordinate[1] + translation[1]]
                }
            })
            return checked
        }

        isCheckedByPawn (board) {
            let checked = false
            const kingCoordinate = this.indexToCoordinates(this.position)
            const translationVectors = { white:[ [1,1], [-1,1] ], black:[ [1,-1], [-1,-1] ] }

            translationVectors[this.opponentColor].forEach(translation => {
                let threatCoordinate = [kingCoordinate[0] + translation[0], kingCoordinate[1] + translation[1]]
                if (this.outOfBounds(...threatCoordinate)) return
                const threatPosition = this.coordinateToIndex(...threatCoordinate)
                if (this.allyPiece(threatPosition, this.color, board)) return
                if ("pawn" === board[threatPosition].name && board[threatPosition].color === this.opponentColor) {
                    checked = true
                    return
                }
            })
            return checked
        }

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
        isChecked(board) {
            let checked = false
            const knightTranslationVectors = [[-2,1], [-1,2], [1,2], [2,1], [2,-1], [1,-2], [-1,-2], [-2,-1]]
            const orthogonalTranslationVectors = [[0,1], [0,-1], [1,0], [-1,0]]
            const diagonalTranslationVectors = [[1,1], [1,-1], [-1,1], [-1,-1]]
            const diagonalAndOrthogonalTranslationVectors = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]]

            if (this.isCheckedByPiece(board, "knight", 1, knightTranslationVectors)) checked = true
            if (this.isCheckedByPiece(board, "rook", 7, orthogonalTranslationVectors)) checked = true
            if (this.isCheckedByPiece(board, "bishop", 7, diagonalTranslationVectors)) checked = true
            if (this.isCheckedByPiece(board, "queen", 7, diagonalAndOrthogonalTranslationVectors)) checked = true
            if (this.isCheckedByPiece(board, "king", 1, diagonalAndOrthogonalTranslationVectors)) checked = true
            if (this.isCheckedByPawn(board)) checked = true
            
            return checked
        }
        
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    
    //////////////showing legal moves////////////////////
    

    const isMoveLegal = (board, king, targetPosition, piece) => {
        const fakePiece = Object.create(piece)
        const fakeBoard = [...board]
        fakeBoard[fakePiece.position] = {position:fakePiece.position, name:"empty", color:"noColor"}
        fakeBoard[targetPosition] = fakePiece
        fakePiece.position = targetPosition
        const theKing = fakePiece.name === "king" ? fakePiece : king //so the king can move out of the way
        if (theKing.isChecked(fakeBoard)) return false 
        return true
    }
    
    const findLegalMoves = (board, piece, allPieces) => {
        const myKing = piece.color === allPieces.kings[0].color ? allPieces.kings[0] : allPieces.kings[1]
        const moves = piece.findMoves(board)
        const legalMoves = moves.filter(move => isMoveLegal(board, myKing, move, piece))
        return legalMoves
    }

    const legalMovesCount = (board, turnColor, allPieces) => {
        const allNonCapturedPieces = Object.values(allPieces).flat().filter(piece => !piece.captured && piece.color === turnColor)
        const allLegalMoves = []
        allNonCapturedPieces.forEach(piece => {
            allLegalMoves.push(...findLegalMoves(board, piece, allPieces))
        })
        return allLegalMoves.length
    }

    const checkEndConditions = (board, otherColor, allPieces) => {
        const turnColor = otherColor === "white" ? "black" : "white"
        //checking for checkmate + stalemate by trapped king
        const kings = allPieces.kings
        const king = turnColor === kings[0].color ? kings[0] : kings[1]
        if (legalMovesCount(board, turnColor, allPieces) === 0){
            if (king.isChecked(board)) return "checkmate"
            else return "stalemate"
        }
    }

    const indexToNotation = index => {
        const numToLetter = {7:"a", 6:"b", 5:"c", 4:"d", 3:"e", 2:"f", 1:"g", 0:"h"}
        const number = Math.floor(index/8 + 1)
        const letter = numToLetter[index % 8]
        return (letter + number) //should return a string because of stupid Javascript typecasting
    }

    const notationToIndex = notation => {
        const letterToNum = {"a":7, "b":6, "c":5, "d":4, "e":3, "f":2, "g":1, "h":0}
        const index = letterToNum[notation.slice(0,1)] + 8 * (parseInt(notation.slice(1,2)) - 1) 
        if (index > 63 || index < 0) console.log("ERROR ERROR ERROR NOT A POSSIBLE INDEX", index) //For debugging purposes
        return index //should return a number between 0 - 63
    }
    
    const convertMoveToMoveNotation = (startPosition, endPosition) => {
        const startingPosition = indexToNotation(startPosition)
        const endingPosition = indexToNotation(endPosition)

        return (startingPosition + endingPosition) //should be a 4 letter string like d2d4
    }

    const MoveNotationToIndex = moveNotation => {
        const piecePosition = notationToIndex(moveNotation.slice(0,2))
        const move = notationToIndex(moveNotation.slice(2,4))
        return [piecePosition, move]
    }

    const makePly = (board, piece, move, ply, allPieces) => {
        const turnColor = ply % 2 === 0 ? "white" : "black"
        if (piece.color === turnColor){
            const startPosition = piece.position
            const newBoard = piece.movePiece(board, move)
            setBoard(newBoard)
            setPly(ply + 1)
            const end = checkEndConditions(newBoard, turnColor, allPieces)
            if (end) {
                fetch(`/games/${gameStats.gameId}`, {
                    method:"PATCH",
                    headers:{"content-type":"application/json"},
                    body:JSON.stringify({ongoing:false, winner:myId, latest_position:"string of position(adding this later)", end_cause:end})
                }).then(resp => resp.json())
                .then(console.log)
            }
            const chessNotationMove = convertMoveToMoveNotation(startPosition, move)
            fetch("/plies", {
                method: "POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify({game_id:gameStats.gameId, move_index:ply, color:gameStats.myColor, move:chessNotationMove})
            }).then(resp => resp.json())
        }
    }

    const handleSelectedPiece = (board, piece, ply, allPieces) => {
        if (selectedPiece.moves.includes(piece.position)) { //Moving a piece
            setSelectedPiece({piece:"", moves:[]})
            makePly(board, selectedPiece.piece, piece.position, ply, allPieces)
            return 
        }
        else if (piece.name !== "empty" && piece.color === gameStats.myColor) { //re-selecting piece options if another movable piece is pressed
            const legalMoves = findLegalMoves(board, piece, allPieces)
            return setSelectedPiece({piece:piece, moves:legalMoves})
        }
        else { //resetting piece options if an empty square is clicked
            return setSelectedPiece({piece:"", moves:[]})
        }
    }

    const callBackPiece = (piece) => {
        handleSelectedPiece(board, piece, ply, allPieces)
    }

    /////////////////////////////////////////////

    return (
        <>
            <ChessBoard 
                board={board} 
                callBackPiece={callBackPiece}
                selectedPiece={selectedPiece}
                myColor={gameStats.myColor}
            />
        </>
    )
}

export default ChessPage