import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// 引入自定义组件
import Main from './Main/index'
import Child from './Child'

class Index extends Component {
    constructor(props, context){
        super(props);
        this.state = {
            isMain: true
        }
    }
    componentWillMount(){
        let host = location.host
        let ifNew = host.indexOf("new-jxjy") > -1
        let env = ifNew ? host.split("new-jxjy")[0] : host.split("jxjy")[0]

        if (env != 'dev-' && env != 't-' && env != 'pre-' && env != '') {
            this.setState({ isMain: false})
        }
    }

    render() {
        return (
            <div>
                {this.state.isMain ? <Main /> : <Child />}
            </div>
        )
    }
}

export default Index