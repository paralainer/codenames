import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import './App.css';
import {NewGame} from "./game/NewGame";
import {AdminPage} from "./game/admin/AdminPage";
import {ParticipantPage} from "./game/participant/ParticipantPage";
import './CommonStyles.css'

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route path="/:gameId/a/:adminId" children={props =>
                        <AdminPage gameId={props.match?.params['gameId']} adminId={props.match?.params['adminId']}/>
                    }/>

                    <Route path="/:gameId" children={props =>
                        <ParticipantPage gameId={props.match?.params['gameId']}/>
                    }/>
                    <Route path="/">
                        <NewGame/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
