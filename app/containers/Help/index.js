import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


// 引入自定义组件
import HelpModel from 'components/HelpModel'

import * as ACTION from 'actions/child'
@connect(
    (state) => { return { state } },
    (dispatch) => bindActionCreators({ ...ACTION }, dispatch)
)
class App extends Component {
    componentWillMount() {
        const pkid = this.props.params.id
        const nameType = this.props.location.query.type
        this.props.getNoticedetail({ pkid })
    }
    render() {
        const { noticedetail } = this.props.state.childReducer

        return (
            <HelpModel title={noticedetail.title} content={noticedetail.content}></HelpModel>
        )
    }
}
export default App