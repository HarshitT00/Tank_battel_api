import { MessageStategy } from "./messageStrategy";
import { GameStartMessage } from "./messageStrategyImpl";

export class BroadCastMessage {
    static GAME_START_MESSAGE  = new GameStartMessage()

    static message(messageType: MessageStategy, username?: string): string {
        return messageType.message()
    }

}

