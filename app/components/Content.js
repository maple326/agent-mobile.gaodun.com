import React, {Component} from 'react'
import {Row, Col} from 'antd';
class Content extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            data: {}
        }
    }

    componentWillMount() {

    }

    render() {
        const {location, children} = this.props
        return (

                <div className="content">
                    {children}
                </div>
        )
    }
}

export default Content;