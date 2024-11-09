export interface MessageStategy {
    toUser(username : string): string,
    message(): string
}