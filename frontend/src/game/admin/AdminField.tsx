import React from 'react'
import {AdminGame, AdminWord} from "../../model/game";
import './AdminField.css'

export interface AdminFieldProps {
    game: AdminGame,
    onOpenCard: (word: AdminWord) => void
}

interface AdminFieldState {
    pendingWord: PendingWord | null
}

interface PendingWord {
    row: number,
    column: number
}

export class AdminField extends React.Component<AdminFieldProps, AdminFieldState> {
    constructor(props: AdminFieldProps) {
        super(props);
        this.state = {pendingWord: null}
    }

    getField(props: AdminFieldProps): Array<Array<AdminWord>> {
        const field = new Array<Array<AdminWord>>(5);
        for (let i = 0; i < 5; i++) {
            field[i] = new Array<AdminWord>(5);
            for (let j = 0; j < 5; j++) {
                field[i][j] = props.game.words.find(word => word.row === i && word.column === j) as AdminWord
            }
        }
        return field
    }

    wordKey(word: AdminWord) {
        return word.value + word.open.toString() + word.color
    }

    cardClass(word: AdminWord) {
        return `wordCard ${word.color.toLowerCase()} ${word.open ? 'open' : ''}`
    }

    render() {
        const field = this.getField(this.props)
        return (
            <div className='gameField'>
                {field.map(row => row.map(word => (
                    <div key={this.wordKey(word)}
                         className={this.cardClass(word)}
                         onClick={() => this.props.onOpenCard(word)}
                    >
                        {word.value}
                    </div>
                )))}
            </div>
        )
    }
}