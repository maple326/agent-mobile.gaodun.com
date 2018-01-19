import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as productAction from '../actions/product';
function matchStateToProps(state) {
	//...
    return {
        state: state.getProduct,
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        ...productAction
    }, dispatch)
}
@connect(matchStateToProps, matchDispatchToProps)
class Product extends Component {
    constructor(props, context){
        super(props);
        this.state = {
            data: {}
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.props.getProduct();
    }
    render() {
        return (
            <div>
                产品
            </div>
        )
    }
}
export default Product