import { MessageStategy } from "./messageStrategy";

export class GameStartMessage implements MessageStategy {
    
    message(username?: string): string {
        if(username){
            return `Hi , ${username} the Game has started `
        }
        return `Game has Started`
    }
}