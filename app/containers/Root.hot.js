import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {AppContainer} from 'react-hot-loader';
import {Router, Route, BrowserRouter, Switch} from 'react-router-dom'
import {syncHistoryWithStore} from 'react-router-redux'
import '../config'
import createHistory from 'history/createHashHistory'
const history = createHistory();
import MainRoute from './MainRoute';
export default class Root extends Component {
    render() {
        const {store} = this.props;
        return (
            <AppContainer>
                <Provider store={store}>
                    <Router history={history}>
                        <MainRoute/>
                    </Router>
                </Provider>
            </AppContainer>
        );
    }
}