import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import '../assets/css/base.less'
import Header from '../components/Header'
import Content from '../components/Content'
import Footer from '../components/Footer'

import Course from './Course'
import Member from './Member'
import About from './About/About'
import NotFound from './NotFound'

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
export default class App extends Component {
    constructor(props, context) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        const {location, children} = this.props
        return (
            <div>
                <Header/>
                <Content>
                    <Route render={(params) => {
                        let {location} = params;
                        return (
                            <ReactCSSTransitionGroup
                                component="div"
                                transitionName='example'
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={500}
                            >
                                <Switch key={location.pathname} location={location}>
                                    <Route component={NotFound}></Route>
                                </Switch>
                            </ReactCSSTransitionGroup>
                        )
                    }}>
                    </Route>

                </Content>
                <Footer></Footer>
            </div>
        )
    }
}