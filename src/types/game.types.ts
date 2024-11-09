import type { WebSocket } from 'ws';

export interface UserState {
    x: number;
    y: number;
}

export interface User {
    username: string;
    state: UserState;
}

export interface Room {
    [x: string]: any;
    id: string;
    users: Record<string, User>;
    connections: Record<string, WebSocket>;
}