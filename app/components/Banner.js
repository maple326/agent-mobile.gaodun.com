import React, { Component } from 'react'
import { Menu } from 'antd';

class Header extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            current: "1"
        }
    }
    componentWillMount() {
        
    }
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    render() {
        var { bgimg, name } = this.props;
        return (
            <div className="banner" style={{ backgroundImage: `url(${bgimg})` }}>
                {
                    name ? 
                    <div className="banner-ct">
                        <h5 className="name">{ name }</h5>
                        <p className="info">会计人员继续教育网上培训</p>
                        <p className="desc">In the Orient young bulls are tested for the fight arena in a certain manner. Each is brought<br/> to the ring and allowed to attack a picador who pricks them with a lance.</p>
                    </div>
                    :
                    ""
                }
            </div>
        )
    }
}

export default Header;