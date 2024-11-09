import { MessageStategy } from "./messageStrategy";
import { GameStartMessage } from "./messageStrategyImpl";

export class BroadCastMessage {
    static GAME_START_MESSAGE  = new GameStartMessage()

    static toUser(messageType: MessageStategy, username: string): string {
        return messageType.toUser(username)
    }

    static message(messageType: MessageStategy): string {
        return messageType.message()
    }

}

