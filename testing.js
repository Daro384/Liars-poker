const waitRoom = [
    {id:1, rating:800, invite:null, inGame:false},
    {id:3, rating:900, invite:null, inGame:false},
    {id:2, rating:1100, invite:null, inGame:false},
    {id:4, rating:2000, invite:null, inGame:false},
    {id:5, rating:2100, invite:null, inGame:false}
]

//invite is the id of the player trying who tries to match with you

while (waitRoom.length > 1)
waitRoom.forEach(player => {
    console.log("I am player ", player.id)
    const myInvite = player.invite
    if (myInvite) {
        //if i have an invite: (yes) 
        //find the person who invited me
        const theInviter = waitRoom.find(thePlayer => thePlayer.id === myInvite)
        //check the inviters invites (if the inviter has an invite then match me with him)
        if (theInviter.invite === player.id) {
            console.log("entering a game with player ", theInviter.id)
            if (theInviter.inGame) {
                //if i join last
                waitRoom.splice(waitRoom.findIndex(playa => playa.id === theInviter.id), 1) //removing the inviter from array
                waitRoom.splice(waitRoom.findIndex(playa => playa.id === player.id), 1) //removing me from the id
                console.log("player ", theInviter.id, " and player ", player.id, " has been removed from the lobby")
            }
            else player.inGame = true //if i join first tell the others that i joined
        }
        else {
            theInviter.invite = player.id
            console.log("Accepting invite from player ", theInviter.id)
        }
    } else {
        console.log("I have no invites")
        console.log("my rating: ", player.rating)
        //if i don't have any invites
        //send invite to the player with the closest rating to me
        const worthyOpponents = waitRoom.filter(otherPlayer => otherPlayer.id !== player.id && otherPlayer.invite === null).sort((a,b) => {
            return Math.abs(a.rating - player.rating) - Math.abs(b.rating - player.rating)
        })
        
        //checking if there are any players to invite before sending invite
        if (worthyOpponents.length > 0) {
            worthyOpponents[0].invite = player.id
            console.log("sending an invite to player ", worthyOpponents[0].id)
        }
    }
    console.log(waitRoom)
})