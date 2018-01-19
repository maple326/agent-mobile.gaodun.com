import React, {Component} from 'react';
import {Button, Menu} from 'antd'
import {Table} from 'antd';
import {Link} from 'react-router'
import {browserHistory} from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as memberAction from 'actions/member';

//引入组件
import Chosetype from './Chosetype'
import Payfor from './Payfor'

function matchStateToProps(state) {
	//...
    return {
        state
    }
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({
        ...memberAction
    }, dispatch)
}
@connect(matchStateToProps, matchDispatchToProps)

class Activetrain extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      data: {},
      list:[],
    }

  }
 
 
  componentWillMount() {
    let token = this.props.state.login.result.token;
    this.props.getActiveListdata(() =>{
      token:token
    })
 
  }
  render() {
    const list = this.props.state.ActiveTrainList.list;
    return(
      <Chosetype list={list}/>
    )
  }
}
export default Activetrain
