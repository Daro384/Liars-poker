import React,{useEffect} from "react"
import { useNavigate } from "react-router-dom"

const Searching = ({search, setSearch, me}) => {

    const navigate = useNavigate()

    const handleCancel = () => {
        setSearch(false)
    }

    useEffect(() => {
        let waitRoomID
        fetch("/waitrooms", {
            method: "POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({ player_id:me.id, rating:me.rating, invite:null, inGame:null})
        }).then(resp => resp.json())
        .then((created_data) => {
            console.log(created_data)
            waitRoomID = created_data.id
        })
        
        const reset = setInterval(() => {fetch("/waitrooms")
        .then(resp => resp.json())
        .then(matchProgress => {
            console.log(matchProgress)
            if (matchProgress.game_id) {
                clearInterval(reset)
                navigate("/game")
            }
        })
        },5000)
        return () => {
            clearInterval(reset)
            fetch(`/waitrooms/${waitRoomID}`, {method:"DELETE"})
            setSearch(false)
        }
    }
    ,[])

    return (
        <div>
            Searching for other players...
            <button onClick={handleCancel}>Cancel</button>
        </div>
    )
}

export default Searching