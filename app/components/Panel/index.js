import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'antd';
import './panel.less';

class Panel extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            
        }
    }
    componentWillMount() {
        
    }
    render() {
        var {children, title, type, hdRight, hdRightLink} = this.props;
        return (
            <div className="panel">
                <div className={`panel-tt ${type ? 'panel-tt-white': ''}`}>{title}
                    {hdRight ? <Link className="panel-tt-right" to={hdRightLink}>{hdRight}<Icon type="right" /></Link> : ''}
                </div>
                <div className="panel-bd">{children}</div>
            </div>
        )
    }
}

export default Panel;