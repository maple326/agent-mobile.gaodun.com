import React, { Component } from 'react'
import { Spin } from 'antd';
import { PROM } from 'util/config'
class Loading extends Component {
    constructor(props, context) {
        super(props);
        this.state = {}
    }

    componentWillMount() {

    }
    render() {
        const { children, text, loading } = this.props
        return (
            loading
            ?
                <Spin tip={text || PROM.loading}>{ children }</Spin>
            :
                children
        )
    }
}

export default Loading;