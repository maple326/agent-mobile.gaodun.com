import React, { Component } from 'react';

export default class About extends Component {
    constructor(props, context){
        super(props);
        this.state = {
            data: {}
        }
    }
    componentWillMount() {
    }
    render() {
        return (
            <div>
                About
            </div>
        )
    }
}