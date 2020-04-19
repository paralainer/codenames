import React from 'react'
import {ParticipantGame, ParticipantWord} from "../../model/game";

export interface ParticipantFieldProps {
    game: ParticipantGame
}

interface ParticipantFieldState {
    pendingWord: PendingWord | null
}

interface PendingWord {
    row: number,
    column: number
}

export class ParticipantField extends React.Component<ParticipantFieldProps, ParticipantFieldState> {
    constructor(props: ParticipantFieldProps) {
        super(props);
        this.state = {pendingWord: null}
    }

    getField(props: ParticipantFieldProps): Array<Array<ParticipantWord>> {
        const field = new Array<Array<ParticipantWord>>(5);
        for (let i = 0; i < 5; i++) {
            field[i] = new Array<ParticipantWord>(5);
            for (let j = 0; j < 5; j++) {
                field[i][j] = props.game.words.find(word => word.row === i && word.column === j) as ParticipantWord
            }
        }
        return field
    }

    wordKey(word: ParticipantWord) {
        return word.value + word.color
    }

    cardClass(word: ParticipantWord) {
        return `wordCard ${word.color ? word.color.toLowerCase() : ''}`
    }

    render() {
        const field = this.getField(this.props)
        return (
            <div className='gameField'>
                {field.map(row => row.map(word => (
                    <div key={this.wordKey(word)}
                         className={this.cardClass(word)}
                    >
                        {word.value}
                    </div>
                )))}
            </div>
        )
    }
}