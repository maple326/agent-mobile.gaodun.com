import React, {Component} from 'react';
import {Link, Route, Switch, matchPath, Redirect} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import Activetrain from "./Activetrain";
import Courselearn from "./Courselearn";
import Selectcourse from "./Selectcourse";
import Finalexam from "./Finalexam";
import Personinfo from "./Personinfo";
import NotFound from "../NotFound";

class Child extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        let {location, match} = this.props;
        return (
            <TransitionGroup>
                <CSSTransition key={location.pathname} location={location} classNames="example"
                               timeout={{enter: 500, exit: 300}}>
                    <Switch>
                        <Route path='/member/activetrain' component={Activetrain}></Route>
                        <Route path='/member/courselearn' component={Courselearn}></Route>
                        <Route path='/member/selectcourse' component={Selectcourse}></Route>
                        <Route path='/member/finalexam' component={Finalexam}></Route>
                        <Route path='/member/personinfo' component={Personinfo}></Route>
                        <Route component={() => {
                            return <Redirect to="/404"></Redirect>
                        }}></Route>
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        )
    }
}

export default Child;