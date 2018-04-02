import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from '../App';
import Chat from './Chat';
import White from './Whiteboard';

export default (
    <Switch>
        <Route exact path='/' component={App} />
        <Route path='/chat' component={Chat} />
        <Route path='/white' component={White} />
    </Switch>
)