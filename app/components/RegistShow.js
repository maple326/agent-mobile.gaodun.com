import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Icon } from 'antd'

import * as ACTION from 'actions/child';
@connect(
    (state) => { return { state } },
    (dispatch) => bindActionCreators({ ...ACTION }, dispatch)
)
class RegistShow extends Component {
    constructor(props, context) {
        super(props);
    }
    getShowRegist() {
        const { agencyinfo } = this.props.state.childReducer
        const { index_menu } = agencyinfo
        for (let i = 0; i < index_menu.length; i++) {
            if (index_menu[i].name == '注册') {
                return true
            }
        }
        
        return false
    }

    render() {
        const showRegist = this.getShowRegist()
        const { onClick, className } = this.props
        
        return (
            <span>
                {
                    showRegist ?
                        (
                            <a onClick={this.props.onClick} className={this.props.className}
                                href="javascript:;">免费注册<Icon type="arrow-right" /></a>
                        )
                        :
                        ('')
                }
            </span>
        )
    }
}
export default RegistShow