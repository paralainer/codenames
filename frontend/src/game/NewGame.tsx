import React from 'react'
import {ApiBaseUrl} from "../config/config";
import {
    withRouter
} from "react-router-dom";
import {RouteComponentProps} from "react-router";

class NewGamePage extends React.Component<RouteComponentProps, any> {

    startGame = async () => {
        const resp = await fetch(ApiBaseUrl + "/game", {
            method: 'post'
        });

        if (!resp.ok) {
            console.log("Error creating new game", resp.statusText, resp.statusText, await resp.json())
            return
        }

        const {adminId, gameId} = await resp.json()
        this.props.history.push(`/${gameId}/a/${adminId}`)
    }


    render() {
        return (
            <div className='newgame'>
                <button onClick={this.startGame}>Начать игру</button>
            </div>
        )
    }
}

export const NewGame = withRouter(NewGamePage)