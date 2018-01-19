import React, {Component} from 'react';
import {Row, Col} from 'antd'
class Jiechild extends Component {
    constructor(props, context) {
        super(props);
        
        this.state = {
            data: {},
            jieImg: [
                {
                    src:require("assets/images/member/yhk.jpg"),
                    bankCode:"BOC-DEBIT"
                },
                {
                    src:require("assets/images/member/zhaoshang.jpg"),
                    bankCode:"CMB-DEBIT"
                },
                {
                    src:require("assets/images/member/jianshe.jpg"),
                    bankCode:"CCB-DEBIT"
                },
                {
                    src:require("assets/images/member/gongshang.jpg"),
                    bankCode:"ICBC-DEBIT"
                },
                {
                    src:require("assets/images/member/jiaotong.jpg"),
                    bankCode:"COMM-DEBIT"
                },
                {
                    src:require("assets/images/member/pingan.jpg"),
                    bankCode:"SPA-DEBIT"
                },
                {
                    src:require("assets/images/member/youzhegn.jpg"),
                    bankCode:"PSBC-DEBIT"
                },
                {
                    src:require("assets/images/member/guangfa.jpg"),
                    bankCode:"GDB-DEBIT"
                },
                {
                    src:require("assets/images/member/minsheng.jpg"),
                    bankCode:"CMBC"
                },
                {
                    src:require("assets/images/member/guangda.jpg"),
                    bankCode:"CEB-DEBIT"
                },
                {
                    src:require("assets/images/member/beijing.jpg"),
                    bankCode:"BJBANK"
                },
                {
                    src:require("assets/images/member/pufa.jpg"),
                    bankCode:"SPDB-DEBIT"
                },
                {
                    src:require("assets/images/member/nongshang.jpg"),
                    bankCode:"SHRCB"
                },
                {
                    src:require("assets/images/member/wenzhou.jpg"),
                    bankCode:"WZCBB2C-DEBIT"
                }
              
            ],
            status:false,
            Chosetab:'0'
        }

    }
    handleImg(item,key){
        this.setState({
            status: !this.state.status,
            Chosetab:key
        })
        // item.active = !item.active;
        // console.log(key)
        console.log(item.bankCode)
        this.props.handleKey(item.bankCode)
    }
    componentWillMount() {

    }
    componentDidMount() {

    }
    render() {
        const {jieImg ,Chosetab} = this.state;
        const {handleKey} = this.props;
        return (
            <div className="Showbank">
                <Row gutter={24}>
                    {jieImg.map((item, key) => (
                        <Col span={4} key={key} >
                            <img src={item.src} id={item.id} key={key} onClick={() => this.handleImg(item,key)} className={Chosetab == key ? "active" : ""} />
                        </Col>
                    ))}

                </Row>
            </div>
        )

    }
}
export default Jiechild