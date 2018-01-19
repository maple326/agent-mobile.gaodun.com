import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom'
import { syncHistoryWithStore } from 'react-router-redux'
import '../config'
//const store = configure({ config: global.$GLOBALCONFIG })
import createHistory from 'history/createHashHistory'
const history = createHistory();
import Main from './MainRoute';
export default class Root extends Component {
    render() {
        const { store } = this.props;
        /*const history = syncHistoryWithStore(myhistory, store)*/
        return (
            <Provider store={store}>
                <Router history={history}>
                    <Main/>
                </Router>
            </Provider>
        );
    }
}