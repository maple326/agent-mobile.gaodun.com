import React, {Component} from 'react';
import {Link, Route, Switch, matchPath, Redirect} from 'react-router-dom';

import 'assets/css/base.less'
import "assets/css/Personcontent.less"
import Title from 'components/Title'
import Banner from 'components/Banner'
import MemberLeftMenu from './MemberLeftMenu'
import Child from './Child'
//import { locale } from '../../../node_modules/_moment@2.19.2@moment';

export default class Member extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            keys: 1
        }
    }

    componentWillMount() {
    }

    render() {
        const {location, children, match} = this.props;
        const {keys} = this.state;
        return (
            <div>
                <Title>个人中心-会计从业继续教育-高顿继续教育</Title>
                <Banner bgimg={require('assets/images/banner.jpg')}/>
                <div className="Personcontent">
                    <div className="Perleft">
                        <MemberLeftMenu keys={keys} location={location}/>
                    </div>
                    <div className="Perright" keys={keys} key={location.pathname}>
                        <Route render={({location, match}) => {
                            return (
                                    <div key={location.pathname}>
                                        <Route path="/member" exact render={()=>{
                                            return <Redirect to="/member/activetrain"></Redirect>
                                        }}></Route>
                                        <Route path={`${match.url}/:id`} location={location} key={location.key} component={Child}></Route>
                                        {/*<Route path={`${match.url}/activetrain`} location={location}
                                           component={Activetrain}></Route>
                                    <Route path="/member/activetrain" location={location}
                                           component={Activetrain}></Route>
                                    <Route path="/member/courselearn" location={location}
                                           component={Courselearn}></Route>
                                    <Route path="/member/selectcourse" location={location}
                                           component={Selectcourse}></Route>
                                    <Route path="/member/finalexam" location={location}
                                           component={Finalexam}></Route>
                                    <Route path="/member/personinfo" location={location}
                                           component={Personinfo}></Route>*/}
                                    </div>
                            )
                        }}></Route>
                    </div>
                </div>
            </div>
        )
    }
}