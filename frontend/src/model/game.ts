export type AdminGame= {
    adminId: string,
} & ParticipantGame

export interface AdminWord {
    row: number,
    column: number,
    value: string,
    open: boolean,
    color: WordColor
}

export interface ParticipantGame {
    gameId: string,
    blueLeft: number,
    redLeft: number,
    words: Array<ParticipantWord>,
    lastUpdated: number
}

export interface ParticipantWord {
    row: number,
    column: number,
    value: string,
    color: WordColor | null
}

export enum WordColor {
    Blue = "Blue",
    Red = "Red",
    Black = "Black",
    Neutral = "Neutral"
}