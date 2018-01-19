import React, {Component} from 'react';
import Login from '../Login'
import './loginDialog.less'

class LoginDialog extends Component {
    constructor(props, context) {
        super(props);
    }

    componentWillMount() {
    }
    render() {
        return ( <Login />)
    }
}
export default LoginDialog