import { RawData } from "ws";
import { BroadCastMessage } from "./brodcastmessage/broadCastMessage";
import { MessageStategy } from "./brodcastmessage/messageStrategy";
import { generatePlayArea } from "./generatePlayArea";
import { PlayArea, Room, User, UserState } from "./types/game.types";

const NUMBER_OF_TANKS = 1;
const NUMBER_OF_PLAYERS = 2;

const playerIndex : Record<string, number>  = {}

const broadCastMessage = ( room : Room , message : MessageStategy) => {

    Object.keys(room.users).forEach(
        ( uuid ) => {
            room.connections[uuid].send(JSON.stringify(message.toUser(room.users[uuid].username)))
        }
    )

}

const intilizeGameState = (room : Room , playArea : PlayArea, ) =>{
    let index = 1
    Object.keys(room.users).forEach(
        (uuid) => {

            playerIndex[uuid] = index++

            let userState: UserState ={
                playArea: playArea,
                playerTurn: 1,
                toKill: false
            }
            room.users[uuid].state = userState
            const message = JSON.stringify(userState)

            console.log(`gameState updated for user: ${room.users[uuid].username} with new state : ${room.users[uuid].state}`)
            room.connections[uuid].send(message)
        }
    )
}

const updateGameState = (room : Room , gameState: UserState) =>{
    Object.keys(room.users).forEach(
        (uuid) => {

            let userState: UserState =gameState

            const message = JSON.stringify(userState)
            room.users[uuid].state = gameState
            console.log(`gameState updated for user: ${room.users[uuid].username} with new state : ${room.users[uuid].state}`)
            room.connections[uuid].send(message)
        }
    )
}

const valid = (room : Room, userId: string , playerId : number): boolean => {

    return room.users[userId].state.playerTurn === playerId
}

const canKill = (state : UserState): boolean => {
    // implement later 

    return true;
}

const kill = (state : UserState): UserState => {
    // implement kill 
    return state
}

const playerHasWon = (state : UserState):boolean => {
    // to implement 
    return false;
}

const playTurn = (userState : UserState , room : Room , userId : string) => {
    const playerId = playerIndex[userId]

    if(!valid(room, userId ,  playerId)) {
        throw {
            message: "Please wait for your turn "
        }   
    }

    //
    const connection = room.connections[userId]
    let user: User = room.users[userId]
    let curState: UserState = user.state

    if(userState.toKill){
        // we wish to kill the opponent 
        if(!canKill(curState)) {
            // send a message that we cannot kill this 
        }

        let newState = kill(curState)  // deletes opponent which can be killed 

        if(playerHasWon(newState)) {
            // end the game 
            // broadcast gameOver message 
        }

    }

    user.state = userState
    user.state.playerTurn = NUMBER_OF_PLAYERS -user.state.playerTurn

    updateGameState(room, user.state)

}


const handleMessage = (message : RawData , room : Room  ) => {
    const user = JSON.parse(message.toString()) as User

    const userState = user.state

    Object.keys(room.users).forEach(
        (uuid) => {
            // catch and throw error 
            try {
                
                playTurn(userState ,room, uuid)
                
            }
            catch(err) {
                room.connections[uuid].on(
                    "error",
                    (err) => {
                        room.connections[uuid].send(err.message)
                    }
                )
            }
            console.log(`user: ${room.users[uuid].username} has updated the state to: ${room.users[uuid].state}`)
        }
    )
}

const gameStart = (room : Room) => {
    Object.keys(room.connections).forEach(
        (uuid) => {
            room.connections[uuid].on(
                "message",
                (message : RawData) => handleMessage(message , room )
            )
        }
    )
}

export const startGame = ( room : Room) => {


    // handle the messages sent from user to us 
    Object.keys(room.connections).forEach(
        (uuid) =>{
            console.log(uuid);
        }
    )

    const playArea = generatePlayArea( NUMBER_OF_TANKS )

    // send message to players game has started 



    intilizeGameState(room , playArea)

    const roomid = room.id

    let userId = {}

    broadCastMessage( room , BroadCastMessage.GAME_START_MESSAGE)

    // starting  the game in 10 sec  sleep for that  

    gameStart(room)

    // send message of the winner
    
    



}


