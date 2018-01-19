import React, { Component } from 'react';
export default class Clues extends Component {
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
                Clues
            </div>
        )
    }
}