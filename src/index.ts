import http, { IncomingMessage } from 'http';
import { WebSocketServer, RawData } from 'ws'; // Import WebSocketServer and RawData
import type { WebSocket } from 'ws'; // Import WebSocket as a type only
import url from 'url';
import { v4 as uuidv4 } from 'uuid';
import { Room, UserState } from './types/game.types';

const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const rooms: Record<string, Room> = {};

const broadcastToRoom = (roomId: string) => {
  const room = rooms[roomId];
  const message = JSON.stringify(room.users);
  Object.values(room.connections).forEach(connection => {
    if (connection.readyState === 1) { // WebSocket.OPEN is 1
      connection.send(message);
    }
  });
};

const handleMessage = (bytes: RawData, uuid: string, roomId: string) => {
  const message = JSON.parse(bytes.toString()) as UserState;
  const room = rooms[roomId];
  const user = room.users[uuid];
  user.state = message;

  broadcastToRoom(roomId);

  console.log(`User: ${user.username} has updated the state ${JSON.stringify(user.state)} in room ${roomId}`);
};

const handleClose = (uuid: string, roomId: string) => {
  const room = rooms[roomId];
  console.log(`User: ${room.users[uuid].username} has disconnected from room ${roomId}`);
  delete room.connections[uuid];
  delete room.users[uuid];

  broadcastToRoom(roomId);
};

const handleConnection = (connection: WebSocket, request: IncomingMessage) => {
  const { query } = url.parse(request.url || '', true);
  const username = query.username as string;
  const roomId = query.roomId as string;

  let room = rooms[roomId];
  if (!room) {
    room = {
      id: roomId,
      users: {},
      connections: {}
    };
    rooms[roomId] = room;
  }

  const uuid = uuidv4();
  console.log(`Username: ${username} logged in to room ${roomId}`);
  console.log(`UUID: ${uuid}`);
  console.log(`RoomID: ${room.id}`)

  room.connections[uuid] = connection;
  room.users[uuid] = {
    username,
    state: {
      x: 0,
      y: 0
    }
  };

  connection.on('message', (message: RawData) => handleMessage(message, uuid, roomId));
  connection.on('close', () => handleClose(uuid, roomId));
};

wsServer.on('connection', handleConnection);

const port = 8000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});