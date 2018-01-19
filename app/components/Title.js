import React, { Component } from 'react'
class Title extends Component {
    constructor(props, context) {
        super(props);
        this.state = {}
    }

    componentDidUpdate() {
        const { children } = this.props
        document.title = children
    }
    render() {
        return (
            <span></span>
        )
    }
}

export default Title;