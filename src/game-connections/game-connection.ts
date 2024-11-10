import { IncomingMessage } from "http";
import { Room } from "../types/game.types";
import type { WebSocket } from 'ws';
import url from 'url';
import { v4 as uuidv4 } from 'uuid';
import { startGame } from "../play";

export class RoomManager {
    private rooms: Record<string, Room>;

    constructor() {
        this.rooms = {};
        this.handleConnection = this.handleConnection.bind(this);
    }

    private createNewRoom(id?: string): string {
        const roomId = id ?? Math.random().toString(36).substring(2, 7);
        // Create new room
        this.rooms[roomId] = {
            id: roomId,
            users: {},
            connections: {}
        };

        return roomId;
    }

    private getRoomId(newRoom: boolean, id?: string): string{
        if(newRoom){
            return this.createNewRoom(id);
        }
        if(!id){
            for(const roomId in this.rooms){
                if(Object.keys(this.rooms[roomId].users).length === 1) return roomId
            }
        }
        return id as string;
    }

    public handleConnection(connection: WebSocket, request: IncomingMessage): void {
        const { query } = url.parse(request.url || '', true);
        const username = query.username as string;
        const newRoom = query.newRoom === 'true';
        
        // Validate username
        if (!username) {
            connection.close(1002, 'Username is required');
            return;
        }

        const roomId = this.getRoomId(newRoom, query.roomId as string | undefined);
        console.log(roomId)
        if(!(roomId in this.rooms)){
            connection.close(1002, 'Something went wrong');

            return;
        }
    
        const uuid = uuidv4();
        const room = this.rooms[roomId];
    
        // Add user to room
        room.connections[uuid] = connection;
        room.users[uuid] = {
            username: username,
            state: {
              toKill: false,
              playerTurn: 1
            }
          }

        if(Object.keys(room.users).length === 2 ){
                startGame(room)
        }
    
        console.log(`Username: ${username} ${newRoom ? 'created' : 'joined'} room ${roomId}`);
        console.log(`UUID: ${uuid}`);
        console.log(`Active rooms: ${Object.keys(this.rooms).length}`);
        console.log(`Users in room ${roomId}: ${Object.keys(room.users).length}`);
    }
};

export const RoomManagerService = new RoomManager();