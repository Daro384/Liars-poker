import React,{useState, useEffect} from "react";
import ChessBoard from "./ChessBoard";

const ChessPage = () => {

    const initializeBoard = [...Array(64).keys()].map(square => {
        return {position:square, name:"empty", color:"noColor"}
    })
    const [board, setBoard] = useState(initializeBoard)
    const [ply, setPly] = useState(0)
    const [allPieces, setPieces] = useState([])
    const [selectedPiece, setSelectedPiece] = useState({piece:"", moves:[]})
    const [myId, setMyId] = useState(null)
    const [gameStats, setGameStats] = useState({gameId:null, myColor:null, myId:null})
    // const [endText, setEndText] = useState("")
    const [whiteTime, setWhiteTime] = useState(0)
    const [blackTime, setBlackTime] = useState(0)
    const [promoPawn, setPromoPawn] = useState({promotion: false, position: null})
    const [players, setPlayers] = useState({myName:"Me", opponentName:"Opponent", myRating:1000, opponentRating:1000})
    // const [stalemateConditions, setStalemateConditions] = useState({fiftyMoveRule:0, repetition:[]})

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

                setWhiteTime(60 * myGame.time) //initializing clocks
                setBlackTime(60 * myGame.time)
                
                if (myGame) {
                    const myColor = myGame.white_player_id === myId ? "white" : "black"

                    setGameStats({gameId:myGame.id, myColor:myColor, myId:myId, increment_time:myGame.increment_time})
                    let newBoard = board
                    let specialMove = false
                    myGame.plies.forEach(ply => {
                        const [piecePosition, move] = MoveNotationToIndex(ply.move)
                        let assigner = newBoard[piecePosition].movePiece(newBoard, move) //can't for the life of me figure out why I can't just mass assign like this: [newBoard, specialMove] (gives me errors)
                        newBoard = assigner[0]
                        specialMove = assigner[1]

                        if (ply.move[4] === "*") { //setting up promotion
                            newBoard[move] = newBoard[move].promote(ply.move.slice(5))
                        }

                        //setting up time
                        const timeToSet = ply.color === "white" ? setWhiteTime : setBlackTime
                        if (ply !== 0) {
                            timeToSet(ply.time_remaining)
                        }
                    })
                    setBoard(newBoard)
                    setPly(ply + myGame.plies.length)

                    const myColorId = myColor === "white" ? {myID:"white_player_id", opponentID:"black_player_id"} : {myID:"black_player_id", opponentID:"white_player_id"}
                    fetch(`/users/${myGame[myColorId.myID]}`)
                    .then(resp => resp.json())
                    .then(myData => {
                        fetch(`/users/${myGame[myColorId.opponentID]}`)
                        .then(resp => resp.json())
                        .then(userData => {
                            setPlayers({myName:myData.display_name, myRating:myData.rating, opponentName:userData.display_name, opponentRating:userData.rating})
                        })
                    })
                    
                    
                }
                
                
            })
        }
        
    },[myId])

    const getLatestPly = () => {
        fetch(`/games/${gameStats.gameId}`).then(resp => resp.json())
        .then(game => {
            if (game.plies.length > ply) {
                let i = 0
                let newBoard = board
                let specialMove = false
                game.plies.slice(ply).forEach(newPly => {
                    const [piecePosition, move] = MoveNotationToIndex(newPly.move)
                    let assigner = newBoard[piecePosition].movePiece(newBoard, move) //read comment on line 45
                    newBoard = assigner[0]
                    specialMove = assigner[1]
                    i += 1

                    if (newPly.move[4] === "*") { //setting up promotion
                        newBoard[move] = newBoard[move].promote(newPly.move.slice(5))
                    }

                    //setting up time
                    const timeToSet = newPly.color === "white" ? setWhiteTime : setBlackTime
                    timeToSet(newPly.time_remaining)
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

    }, [gameStats, ply]) //game

    
    useEffect(() => {
        const colorToDecrement = ply % 2 === 0 ? [setWhiteTime, whiteTime] : [setBlackTime, blackTime]
        let counter = 0
        const handleTime = () => {
            counter += 1
            if (ply !== 0) colorToDecrement[0](colorToDecrement[1] - counter) //setColorTime(colorTime - 1)
        }
        const intervalId = setInterval(handleTime, 1000)
        return () => {
            clearInterval(intervalId)
        } 

    },[ply])
    

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
            return [newBoard, false]
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

        constructor(name, position, color){
            super(name, position, color)
            this.enPassant = null
        }


        findMoves(board){
            const moves = []
            const thisPositionCoordinate = this.indexToCoordinates(this.position)
            const moveTranslationVector = this.color === "white" ? [0,1] : [0,-1]
            const captureTranslationVectors = this.color === "white" ? [[1,1],[-1,1]] : [[1,-1],[-1,-1]]

            const range = this.firstMove ? 2 : 1

            let potentialMove = [thisPositionCoordinate[0] + moveTranslationVector[0], thisPositionCoordinate[1] + moveTranslationVector[1]]

            if (this.enPassant) moves.push(this.enPassant) 

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
        movePiece(board, position) {
            const newBoard = [...board]
            newBoard[this.position] = {position:this.position, name:"empty", color:"noColor"}
            //En Passant
            if (Math.abs(this.position - position) === 16) { //only possible if pawn moves two squares
                const positionCoordinate = this.indexToCoordinates(position)
                for (const i of [-1, 1]){
                    const adjacentCoordinate = [positionCoordinate[0] + i, positionCoordinate[1]]
                    if (this.outOfBounds(adjacentCoordinate)) continue
                    const adjacentIndex = this.coordinateToIndex(...adjacentCoordinate)
                    if (board[adjacentIndex].name === "pawn" && board[adjacentIndex].color === this.opponentColor){
                        board[adjacentIndex].enPassant = (this.position + position) / 2
                    }
                }
            }
            this.position = position
            if (board[position].name !== "empty"){
                const capturedPiece = board[position]
                capturedPiece.captured = true
                capturedPiece.position = null
            }
            if (this.enPassant === position){
                //en Passant
                const behindSquare = this.color === "white" ? position - 8 : position + 8
                const capturedPiece = board[behindSquare]
                console.log("i am capturing this piece: ")
                console.log(capturedPiece)
                capturedPiece.captured = true
                capturedPiece.position = null
                newBoard[behindSquare] = {position:behindSquare, color:"noColor", name:"empty"}
            }
            let specialMove = false
            if ([0,7].includes(Math.floor(this.position / 8))) {
                specialMove = "promote" 
            }
            newBoard[position] = this
            this.firstMove = false
            this.enPassant = false
            return [newBoard, specialMove]
        }

        promote(pieceName) {
            switch (pieceName){
                case "rook":
                    return new Rook("rook", this.position, this.color)
                case "knight":
                    return new Knight("knight", this.position, this.color)
                case "bishop":
                    return new Bishop("bishop", this.position, this.color)
                case "queen":
                    return new Queen("queen", this.position, this.color)
            }
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
                    if (![threatPiece, "empty"].includes(board[threatPosition].name)) break
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
            const translationVectors = { white:[ [1,-1], [-1,-1] ], black:[ [1,1], [-1,1] ] } //think backwards

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
            if (checked) console.log("check")
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
            //adding castling
            if (this.firstMove) {
                const originalKingPosition = this.position
                for (const a of [[-1, -2],[ 1, 2, 3]]){ //i think it works????
                    let illegal = false
                    for (const i of a) {
                        if (illegal) break
                        this.position = originalKingPosition + i
                        if (board[this.position].name !== "empty") illegal = true
                        else if (this.isChecked(board)) illegal = true                    
                    }
                    const rookSquare = a[0][0] < 0 ? originalKingPosition - 3 : originalKingPosition + 4
                    if (board[rookSquare].name !== "rook" || !board[rookSquare].firstMove) illegal = true

                    if (!illegal) moves.push(originalKingPosition + a[1])
                }
                this.position = originalKingPosition
            }
            return moves
        }

        movePiece(board, position) {
            const newBoard = [...board]
            newBoard[this.position] = {position:this.position, name:"empty", color:"noColor"}
            const originalPosition = this.position
            this.position = position
            if (board[position].name !== "empty"){
                const capturedPiece = board[position]
                capturedPiece.captured = true
                capturedPiece.position = null
            }
            //move rook when king castles
            if (Math.abs(originalPosition - position) === 2) { //can only happen if king moves 2 squares horizontally (which only happens during castling)
                const rookPosition = originalPosition - position > 0 ? originalPosition - 3 : originalPosition + 4 //determining which rook
                const theRook = newBoard[rookPosition] //selecting correct rook
                newBoard[rookPosition] = {position:rookPosition, name:"empty", color:"noColor"} //removing rook from original square
                theRook.position = (originalPosition + position) / 2 //updating rook position
                newBoard[theRook.position] = theRook //placing rook on correct square
            }
            newBoard[position] = this
            this.firstMove = false
            return [newBoard,false]
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
            if (king.isChecked(board)) {
                console.log("Checkmate")
                return "checkmate"
            }
            else {
                console.log("stalemate")
                return "stalemate"
            }
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

    const makePly = (board, piece, move, ply, allPieces, promote=false) => {
        const turnColor = ply % 2 === 0 ? "white" : "black"
        if (piece.color === turnColor){
            const startPosition = piece.position
            let newBoard
            let specialMove
            [newBoard, specialMove] = piece.movePiece(board, move)

            //remove En Passant from all of your colored pawns (they only have one move to do En passant)
            allPieces.pawns.filter(onePiece => onePiece.color === turnColor).forEach(pawn => pawn.enPassant = null)

            setBoard(newBoard)
            setPly(ply + 1)
            const end = checkEndConditions(newBoard, turnColor, allPieces)
            let chessNotationMove = convertMoveToMoveNotation(startPosition, move)

            if (promote) chessNotationMove += `*${promote}`

            //handling time
            const whichTime = turnColor === "white" ? whiteTime : blackTime
            const whichTimeToSet = turnColor === "white" ? setWhiteTime : setBlackTime
            whichTimeToSet(whichTime + gameStats.increment_time)

            //making a string of the board position
            const zipPiece = (piece, position, color) => { 
                const nameReducer = {pawn:"p", rook:"r", knight:"n", bishop:"b", queen:"q", king:"k"}
                let zipped = nameReducer[piece] + position

                if (color === "white") zipped = zipped.toUpperCase()
                return zipped
            }

            let zippedPosition = ""
            Object.values(allPieces).flat().filter(piece => piece.position !== null).forEach(piece => zippedPosition += zipPiece(piece.name, piece.position, piece.color))
            

            fetch("/plies", {
                method: "POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify({game_id:gameStats.gameId, move_index:ply, color:gameStats.myColor, move:chessNotationMove, time_remaining:whichTime + gameStats.increment_time})
            }).then(resp => resp.json())
            
            const patchBody = end ? {ongoing:false, winner:myId, latest_position:zippedPosition, end_cause:end} : {latest_position: zippedPosition}
            fetch(`/games/${gameStats.gameId}`, {
                method:"PATCH",
                headers:{"content-type":"application/json"},
                body:JSON.stringify(patchBody)
            }).then(resp => resp.json())
            // .then(console.log)
        }
    }

    const handleSelectedPiece = (board, piece, ply, allPieces) => {
        if (selectedPiece.piece.name === "pawn" && [0,7].includes(Math.floor(piece.position / 8))) {
            setPromoPawn({promotion:true, position:piece.position})
            // setSelectedPiece({...selectedPiece, move: })
        }

        else if (selectedPiece.moves.includes(piece.position)) { //Moving a piece
            setSelectedPiece({piece:"", moves:[]})
            makePly(board, selectedPiece.piece, piece.position, ply, allPieces)
            setPromoPawn({promotion:false, position:null})
            return 
        }
        else if (piece.name !== "empty" && piece.color === gameStats.myColor) { //re-selecting piece options if another movable piece is pressed
            const legalMoves = findLegalMoves(board, piece, allPieces)
            setPromoPawn({promotion:false, position:null})
            return setSelectedPiece({piece:piece, moves:legalMoves})
        }
        else { //resetting piece options if an empty square is clicked
            setPromoPawn({promotion:false, position:null})
            return setSelectedPiece({piece:"", moves:[]})
        }
    }

    const callBackPromote = (pieceName) => {
        const pawnIndex = allPieces.pawns.findIndex(pawn => pawn.position === selectedPiece.piece.position)
        allPieces.pawns[pawnIndex] = allPieces.pawns[pawnIndex].promote(pieceName)
        setPieces({...allPieces})
        makePly(board, allPieces.pawns[pawnIndex], promoPawn.position, ply, allPieces, pieceName)
        setPromoPawn({promotion:false, position:null})
    }

    const callBackPiece = (piece) => {
        handleSelectedPiece(board, piece, ply, allPieces)
    }

    /////////////////////////////////////////////
    const addZeroToSingleDigit = number => { //example: 4 => 04
        if (number < 10) {
            return "0" + number.toString()
        } else return number.toString()
    }

    const pickPromotion = promoPawn.promotion ? 
    <div>
        <button onClick={() => callBackPromote("rook")}>Rook</button>
        <button onClick={() => callBackPromote("bishop")}>Bishop</button>
        <button onClick={() => callBackPromote("knight")}>Knight</button>
        <button onClick={() => callBackPromote("queen")}>Queen</button>
    </div>
    :
    <></>

    const opponentColor = gameStats.myColor === "white" ? "black" : "white"

    return (
        <>
            <ChessBoard 
                board={board} 
                callBackPiece={callBackPiece}
                selectedPiece={selectedPiece}
                myColor={gameStats.myColor}
            />
            <div id="information">
                <div id="my-details">
                    <p className={`${gameStats.myColor}-timer`}>{Math.floor(whiteTime/60)}:{addZeroToSingleDigit(whiteTime%60)}</p>
                    <p className="player-details">{players.myName}</p>
                    <p className="player-details">Rating: {players.myRating}</p>
                </div>
                <div id="opponent-details">
                    <p className={`${opponentColor}-timer`}>{Math.floor(blackTime/60)}:{addZeroToSingleDigit(blackTime%60)}</p>
                    <p className="player-details">{players.opponentName}</p>
                    <p className="player-details">Rating: {players.opponentRating}</p>
                </div>
                
            </div>
            {pickPromotion}
        </>
    )
}

export default ChessPage