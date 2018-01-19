import React, {Component} from 'react';
import {
    HashRouter,
    Route,
    Link,
    Switch,
    Redirect,
} from 'react-router-dom'
import {connect} from 'react-redux'
import '../assets/css/base.less'
import Index from './Index'
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import Course from './Course'
import Member from './Member'
import About from './About/About'
import NotFound from './NotFound'
import Exercise from './Course/Exam/Exercise';
import Examine from './Course/Exam/Examine';

import Header from '../components/Header'
import Content from '../components/Content'
import Footer from '../components/Footer'

class Basic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }

    componentWillMount() {

    }

    componentWillUpdate() {

    }

    render() {
        return (
            <div>
                {this.state.show ? <Header/> : ''}
                <Content>
                    <Route render={({location}) => {
                        return (
                            <TransitionGroup>
                                <CSSTransition key={location.pathname} location={location} classNames="example"
                                               timeout={{enter: 500, exit: 300}}>
                                    <Switch location={location} key={location.pathname}>
                                        <Route exact path="/" location={location} component={Index}></Route>
                                        <Route exact path="/course" location={location} component={Course}></Route>
                                        <Route path="/member" location={location} component={Member}></Route>
                                        <Route path="/about" location={location} component={About}></Route>
                                        <Route path="/course/exam/exercise" location={location}
                                               component={Exercise}></Route>
                                        <Route path="/course/exam/examine" location={location}
                                               component={Examine}></Route>
                                        <Route path="/404" location={location} component={() => {
                                            return <NotFound/>
                                        }}></Route>
                                        <Route render={() => {
                                            return <Redirect to="/404"/>
                                        }}></Route>
                                    </Switch>
                                </CSSTransition>
                            </TransitionGroup>
                        )
                    }}>
                    </Route>
                </Content>
                {this.state.show ? <Footer/> : ''}
            </div>
        )
    }

}

export default Basic
