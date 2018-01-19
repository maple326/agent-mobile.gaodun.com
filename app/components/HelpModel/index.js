import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


// 引入自定义组件
import Title from 'components/Title'
import Banner from 'components/Banner'

import * as ACTION from 'actions/child'
@connect(
    (state) => { return { state } },
    (dispatch) => bindActionCreators({ ...ACTION }, dispatch)
)
class Help extends Component {
    render() {
        const { agencyinfo } = this.props.state.childReducer
        const { children, title, content } = this.props

        return (
            <div>
                <Title>{`${title}-高顿继续教育`}</Title>
                {/* banner */}
                <Banner bgimg={require("assets/images/childbanner.jpg")} name={agencyinfo.name} />
                {/* 学习流程 */}
                <div className="layer-for-body">
                    <div className="layer-for-body-ct">
                        <div className="help-box">
                            <div className="help-box-hd" dangerouslySetInnerHTML={{ __html: title }}></div>
                            <div className="help-box-bd" dangerouslySetInnerHTML={{ __html: content }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Help