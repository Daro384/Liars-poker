import { all } from "mathjs";
import React,{useState, useEffect} from "react";
import {useParams} from "react-router-dom"
import "./GameView.css"

const GameViewer = () => {

    const {id} = useParams()

    const [gameStats, setGameStats] = useState({latest_position:"", plies:[]})
    const [allPositions, setAllPositions] = useState([])
    const [index, setIndex] = useState(null)

    useEffect(() => {
        fetch(`/games/${id}`)
        .then(resp => resp.json())
        .then(setGameStats)
    }, [])

    useEffect(() => {
        if (!gameStats.ongoing) {

            const positions = ["p8p9p10p11p12p13p14p15P48P49P50P51P52P53P54P55r0r7R56R63n1n6N57N62b2b5B58B61k3K59q4Q60"]
            const board = unzipPosition(positions[0])

            const notationToIndex = notation => {
                const letterToNum = {"a":7, "b":6, "c":5, "d":4, "e":3, "f":2, "g":1, "h":0}
                const index = letterToNum[notation.slice(0,1)] + 8 * (parseInt(notation.slice(1,2)) - 1) 
                if (index > 63 || index < 0) console.log("ERROR ERROR ERROR NOT A POSSIBLE INDEX", index) //For debugging purposes
                return index //should return a number between 0 - 63
            }
            gameStats.plies.forEach(ply => {
                const preCoordinate = notationToIndex(ply.move.slice(0,2))
                const postCoordinate = notationToIndex(ply.move.slice(2,4))
                const pieceToMove = board[preCoordinate]
                board[preCoordinate] = ""
                board[postCoordinate] = pieceToMove
                positions.push(zipPosition(board))
            })
            setAllPositions(positions)
            setIndex(positions.length - 1)
        }
    }, [gameStats])

    const zipPosition = board => {
        const pieceConverter = {
            "♙":"P", "♘":"N", "♗":"B", "♖":"R", "♕":"Q", "♔":"K",
            "♟":"p", "♞":"n", "♝":"n", "♜":"r", "♛":"q", "♚":"k"
        }
        let zippedPosition = ""

        for (let i in board) {
            if (board[i] === "") continue
            else {
                zippedPosition += pieceConverter[board[i]] + i
            }
        }
        return zippedPosition
    }

    const unzipPosition = (zippedPosition) => {
        const board = Array(64).fill("")
        const pieces = []
        const positions = []
        let currentNum = ""
        for (const character of zippedPosition) {
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
        return board
    }

    const board = index !== null ? unzipPosition(allPositions[index]) : unzipPosition(gameStats.latest_position)
    let squareIndex = 0
    const chessCells = board.map(cell => {
        const checkeredPattern = (squareIndex + Math.floor(squareIndex/8)) % 2 === 0 ? "white-square" : "black-square"
        squareIndex += 1
        return (
        <div 
            key={squareIndex}
            className={`${checkeredPattern}`}
            >{cell}
        </div>)
    })

    const handleIncrement = () => {
        if (allPositions.length - 1 > index) {
            setIndex(index + 1)
        }   
    }
    const handleDecrement = () => {
        if (0 < index) {
            setIndex(index - 1)
        } 
    }

    const handleMax = () => {
        setIndex(allPositions.length - 1)
    }
    
    const handleMin = () => {
        setIndex(0)
    }

    return (
        <>
            <div id="review-board">
                {chessCells}
            </div>
            <div id="nav-container">
                <div className="arrow" onClick={handleMin}>«</div>
                <div className="arrow" onClick={handleDecrement}>‹</div>
                <div className="arrow" onClick={handleIncrement}>›</div>
                <div className="arrow" onClick={handleMax}>»</div>
            </div>
        </>
    )
}

export default GameViewer