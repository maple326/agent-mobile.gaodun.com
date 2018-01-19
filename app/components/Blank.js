import React, {Component} from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import pubsub from '../util/Pubsub';


class Blank extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            img: require("assets/images/member/blank.png"),
            text: '暂无数据',
            go:' ',
            flag:false,
            case:3
        }
    }
    handleCase(){
        pubsub.publish('case',this.state.case)
    }
    render() {
        const {img, text ,go ,flag} = this.state;
        const {getImg, getText, children, blank ,getGo ,doflag} = this.props
        return (blank
            ? <div className="blankBox">
                    <div className="blackCon">
                        <img src={getImg || img}/>
                        <p>{getText || text}
                        </p>
                        {doflag || flag?
                        <p><Link to={`/member/selectcourse`}><Button onClick={() =>this.handleCase()} type="primary">{ getGo || go}</Button></Link></p>
                        :
                        ""
                        }
                    </div>
                </div>
            : children)

    }
}
export default Blank;