import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Model2 extends Component {    
    constructor(props, context){
        super(props);
        this.state = {
            
        }
    }
    componentWillMount(){
    }
    render() {
        const { children } = this.props
        
        return (
            <div>login model2</div>
        )
    }
}

export default Model2