import React,{useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import Searching from "./Searching"
import MiniChessBoard from "./MiniChessBoard"
import "./Home.css"


const HomePage = () => {

    const navigate = useNavigate()

    const [search, setSearch] = useState(false)
    const [me, setMe] = useState({id:null})
    const [timeControls, setTimeControls] = useState([10,1])
    const [myGames, setMyGames] = useState([{latest_position:"", white_player_id:null}])

    useEffect(() => {
        fetch("/me")
        .then(resp => resp.json())
        .then(setMe)
    }, [])

    useEffect(() => {
        if (me.id) {
            fetch(`/my_games/${me.id}`)
            .then(resp => resp.json())
            .then(games => {
                games = games.sort((a, b) => b.id - a.id) //sort by id to get the latest games in order
                setMyGames(games)
            })
        }
    }, [me])

    const showSearching = search ? <Searching search={search} setSearch={setSearch} me={me} timeControls={timeControls}/> : <></>

    const handlePlay = (totalTime, timeIncrement) => {
        setTimeControls([totalTime, timeIncrement])
        setSearch(true)
    }

    const sideColor = (myId, white_id) => {
        return myId === white_id ? "white" : "black"
    }

    const game1Color = sideColor(me.id, myGames[0]?.white_player_id)
    const game2Color = sideColor(me.id, myGames[1]?.white_player_id)
    const game3Color = sideColor(me.id, myGames[2]?.white_player_id)

    const handleReviewClick = id => {
        if (id) navigate(`/review/${id}`)
    }

    
    return (
        <>
            <div id="main-holder">
                <h2 className="subtitle">Play</h2>
                <div className="play-holder">
                    <div id="match-made">
                        <div 
                            onClick={() => handlePlay(1,1)}
                            className="match"
                        >1+1<br/>Bullet
                        </div>
                        
                        <div 
                            onClick={() => handlePlay(3,1)}
                            className="match"
                        >3+1<br/>Blitz
                        </div>

                        <div 
                            onClick={() => handlePlay(10,1)}
                            className="match"
                        >10+1<br/>Rapid
                        </div>
                    </div>
                    <div id="custom">Custom</div>
                </div>

                <h2 className="subtitle">Recent Games</h2>
                <div id="chess-history">
                    <div className={`chess-game ${game1Color}-side`} onClick={() => handleReviewClick(myGames[0]?.id)}>
                        <MiniChessBoard chessPosition={myGames[0]?.latest_position} myColor={game1Color}/>
                    </div>
                    <div className={`chess-game ${game2Color}-side`} onClick={() => handleReviewClick(myGames[1]?.id)}>
                        <MiniChessBoard chessPosition={myGames[1]?.latest_position} myColor={game2Color}/>
                    </div>
                    <div className={`chess-game ${game3Color}-side`} onClick={() => handleReviewClick(myGames[2]?.id)}>
                        <MiniChessBoard chessPosition={myGames[2]?.latest_position} myColor={game3Color}/>
                    </div>
                </div>

                <div id="full-history">Full history</div>
            </div>
            {showSearching}
            
        </>
    )
}

export default HomePage