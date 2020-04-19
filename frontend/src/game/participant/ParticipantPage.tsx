import React from 'react'
import {ParticipantGame} from "../../model/game";
import {ApiBaseUrl} from "../../config/config";
import {ParticipantField} from "./ParticipantField";

interface ParticipantPageProps {
    gameId: string
}

interface ParticipantPageState {
    game: ParticipantGame | null,
    notFound: boolean
}

export class ParticipantPage extends React.Component<ParticipantPageProps, ParticipantPageState> {

    constructor(props: ParticipantPageProps) {
        super(props);
        this.state = {game: null, notFound: false}
    }

    async componentDidMount() {
        await this.refreshGame();
        setInterval(() => {
            this.refreshGame()
        }, 3000)
    }

    refreshGame = async () => {
        const {gameId} = this.props
        const resp = await fetch(ApiBaseUrl + `/game/${gameId}`)
        if (resp.ok) {
            const game = await resp.json()
            this.setState({game})
        } else {
            this.setState({notFound: true})
        }
    }

    render() {
        let {game, notFound} = this.state;
        if (game) {
            return (
                <div>
                    <ParticipantField game={game}/>
                    <div className='footer'>
                        <div>Осталось: </div>
                        <div className='score blue'>
                            {game.blueLeft}
                        </div>
                        <div className='score red'>
                            {game.redLeft}
                        </div>
                    </div>
                </div>
            )
        } else {
            const message = notFound ? "Not found" : "Loading..."
            return (
                <div>{message}</div>
            )
        }
    }
}
