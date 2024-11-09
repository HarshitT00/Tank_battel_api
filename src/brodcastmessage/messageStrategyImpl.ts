import { MessageStategy } from "./messageStrategy";

export class GameStartMessage implements MessageStategy {
    toUser(username: string): string {
        return `Game has started ${username}`
    }
    message(): string {
        return "Game is starting "
    }
}