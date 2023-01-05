import React,{useState} from "react";



const ChatBox = ({chats, myId, gameId, setChats, myName, opponentName}) => {
    const [message, setMessage] = useState("")

    const messageElements = chats.map(chat => {
        return <p key={Math.random()}>{`${chat.display_name}: ${chat.message}`}</p>
    })

    const onChatSubmit = (event) => {
        event.preventDefault()
        fetch("/chats", {
            method: "POST",
            headers: {"content-type":"application/json"},
            body: JSON.stringify({message:message, user_id:myId, game_id:gameId})
        }).then(resp => resp.json())
        .then(message => {
            const newMessage = {message:message.message, display_name: message.user_id == myId ? myName : opponentName}
            setChats([...chats, newMessage])
        })
    }


    return (
        <div id="chat-holder">
            <h3>Chat</h3>
            <div id="message-holder">
                {messageElements}
            </div>
            <form onSubmit={onChatSubmit}>
                <input type="text" onChange={event => {setMessage(event.target.value)}}/>
                <input type="submit"/>
            </form>
            
        </div>
    )
}

export default ChatBox