import { RawData } from "ws";
import { BroadCastMessage } from "./brodcastmessage/broadCastMessage";
import { MessageStategy } from "./brodcastmessage/messageStrategy";
import { generatePlayArea } from "./generatePlayArea";
import { PlayArea, Room, User, UserState } from "./types/game.types";
import { error } from "console";

const NUMBER_OF_TANKS = 1;
const NUMBER_OF_PLAYERS = 3;

const playerIndex : Record<string, number>  = {}

const broadCastMessage = ( room : Room , message : MessageStategy) => {

    Object.keys(room.users).forEach(
        ( uuid ) => {
            room.connections[uuid].send(JSON.stringify(message.toUser(room.users[uuid].username)))
        }
    )

}

const intilizeGameState = (room : Room , playArea : PlayArea, ) =>{
    console.log(room.id)
    let index = 1
    Object.keys(room.users).forEach(
        (uuid) => {
            console.log(`initlize state : ${room.users[uuid].username}`)
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
    console.log(`user state update from user : ${userState.playerTurn}`)
    const playerId = playerIndex[userId]

    if(!valid(room, userId ,  playerId)) {
        console.log(`throwing error `)
        throw new Error(
           "Please Wait for your turn "
        )  
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
    console.log(`user player turn : ${user.state.playerTurn}`)
    user.state.playerTurn = NUMBER_OF_PLAYERS -user.state.playerTurn

    updateGameState(room, user.state)

}


const handleMessage = (message : RawData , room : Room , userId: string ) => {
    
    const userState = JSON.parse(message.toString()) as UserState    
    
    console.log(userState.playArea, userState.playerTurn, userState.toKill)


    try{
        playTurn(userState, room , userId)
    } catch(err){
        console.error(err)
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        room.connections[userId].send(JSON.stringify(errorMessage));
    }
}

const gameStart = (room : Room) => {
    console.log(`game start in room : ${room.id}`)
    Object.keys(room.connections).forEach(
        (uuid) => {
            room.connections[uuid].on(
                "message",
                (message : RawData) => handleMessage(message , room , uuid)
            )
        }
    )
}

export const startGame = ( room : Room) => {


    // handle the messages sent from user to us 
    Object.keys(room.connections).forEach(
        (uuid) =>{
            console.log(`uuid : ${uuid} and user : ${room.users[uuid]}`);
            
        }
    )

    const playArea = generatePlayArea( NUMBER_OF_TANKS )

    // send message to players game has started 

    console.log(`playarea : ${playArea}`)


    intilizeGameState(room , playArea)

    const roomid = room.id

    let userId = {}

    console.log(`room with id : ${room.id}`)

    broadCastMessage( room , BroadCastMessage.GAME_START_MESSAGE)

    // starting  the game in 10 sec  sleep for that  

    console.log(`starting game `)
    gameStart(room)

    // send message of the winner
    
    



}


