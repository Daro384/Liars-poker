import React,{useState, useEffect} from "react";
import Searching from "./Searching";
import "./Home.css"


const HomePage = () => {

    const [search, setSearch] = useState(false)
    const [me, setMe] = useState({})

    useEffect(() => {
        fetch("/me")
        .then(resp => resp.json())
        .then(setMe)
    }, [])

    const showSearching = search ? <Searching search={search} setSearch={setSearch} me={me}/> : <></>

    const handlePlay = () => {
        setSearch(true)
    }


    return (
        <>
            <div id="main-holder">
                <div className="play-holder">
                    <div id="match-made">
                        <div 
                            onClick={handlePlay}
                            className="match"
                        >1+1<br/>Bullet
                        </div>
                        
                        <div 
                            onClick={handlePlay}
                            className="match"
                        >3+1<br/>Blitz
                        </div>

                        <div 
                            onClick={handlePlay}
                            className="match"
                        >10+1<br/>Rapid
                        </div>
                    </div>
                    <div id="custom">Custom</div>
                </div>
            </div>
            {showSearching}
            
        </>
    )
}

export default HomePage