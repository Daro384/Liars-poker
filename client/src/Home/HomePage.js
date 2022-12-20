import React,{useState, useEffect} from "react";
import Searching from "./Searching";


const HomePage = () => {

    const [search, setSearch] = useState(false)
    const [me, setMe] = useState({})

    useEffect(() => {
        fetch("/me")
        .then(resp => resp.json())
        .then(setMe)
    }, [])

    const showSearching = search ? <Searching search={search} setSearch={setSearch} me={me}/> : <></>

    const handleCreate = () => {
        fetch("/users", {
            method:"POST",
            headers: {"content-type":"application/json"},
            body: JSON.stringify({
                username: "Joseph",
                password: "1234",
                display_name: "LoL-is-Better",
                rating: 1383
            })
        })
    }

    const handleQuickPlay = event => {
        setSearch(true)
    }


    return (
        <>
            <button onClick={handleQuickPlay}>Quick Play</button>
            {showSearching}
            <button onClick={handleCreate}>create</button>
        </>
    )
}

export default HomePage