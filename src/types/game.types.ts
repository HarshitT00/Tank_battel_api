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
    id: string;
    users: Record<string, User>;
    connections: Record<string, WebSocket>;
}