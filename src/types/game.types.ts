import type { WebSocket } from 'ws';

export interface UserState {
    playerTurn: number;
    playArea?: PlayArea;
    toKill: boolean;
}

export interface User {
    username: string;
    state: UserState;
}

export interface Room {
    id: string;
    users: Record<string, User>;
    connections: Record<string, WebSocket>;
}

export interface PlayArea {
    grid: number[][];
    playerpos: PlayerPos;
}

export interface PlayerPos {
    playerAPos: [number, number][]
    playerBPos: [number, number][]
}

