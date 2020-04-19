import React from 'react'
import {AdminGame, AdminWord} from "../../model/game";
import {ApiBaseUrl} from "../../config/config";
import {AdminField} from "./AdminField";

interface AdminPageProps {
    gameId: string,
    adminId: string
}

interface AdminPageState {
    game: AdminGame | null,
    notFound: boolean
}

export class AdminPage extends React.Component<AdminPageProps, AdminPageState> {

    constructor(props: AdminPageProps) {
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
        const {adminId, gameId} = this.props
        const resp = await fetch(ApiBaseUrl + `/game/${gameId}/a/${adminId}`)
        if (resp.ok) {
            const game = await resp.json()
            this.setState({game})
        } else {
            this.setState({notFound: true})
        }
    }

    openCard = async (word: AdminWord) => {
        await fetch(ApiBaseUrl + '/game/word/open', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gameId: this.state.game!.gameId,
                adminId: this.state.game!.adminId,
                row: word.row,
                column: word.column
            })
        })
        await this.refreshGame()
    }

    participantLink = () => window.location.origin + "/" + this.props.gameId

    render() {
        let {game, notFound} = this.state;
        if (game) {
            return (
                <div>
                    <AdminField game={game} onOpenCard={this.openCard}/>
                    <div className='footer'>
                        <div>Осталось:</div>
                        <div className='score blue'>
                            {game.blueLeft}
                        </div>
                        <div className='score red'>
                            {game.redLeft}
                        </div>
                        <div className={'participantLink'}>
                            <a href={this.participantLink()} target="_blank" rel="noopener noreferrer">Ссылка для команд</a>
                        </div>
                    </div>
                </div>
            )
        } else {
            const message = notFound ? "Not found" : "Loading..."
            return (<div>{message}</div>)
        }
    }
}
