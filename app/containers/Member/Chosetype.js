import React, {Component} from 'react';
import {
  Button,
  Menu,
  Table,
  Row,
  Col,
  Checkbox
} from 'antd'
import {Link} from 'react-router'
import Blank from '../../components/Blank'
import pubsub from '../../util/Pubsub'

class Chosetype extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      data: {},
      total: 0,//显示价格
      Chosed: [],//选择的课程列表
      code: '',
      checked: false,//选择课程按钮
      arr:[],//选择课程 中间数组
      pid:[],//跳转下个页面url传输的pkid数组
    }
  }
  //按钮点击选择课程
  onChange(item,cont) {
    let {arr} = this.state;
    let t = this.state.total;
    item.checked = !item.checked;
    this.setState({
        cont: this.state.cont
    })
    if (item.checked) {
        t += parseFloat(item.price)*100
        let pid=this.state.pid
        pid.push(item.pkid);
        arr.push(item);
        this.setState({
            total: t,
            Chosed:arr
        })
        for(let a=0;a<cont.length;a++){
            if(cont[a].year == item.year){
                cont[a].disabled = true;
                item.disabled = false;
            }
        }
    } else {
        t -= parseFloat(item.price)*100
        let pid=this.state.pid
        pid.splice(item,1);
        arr.splice(item,1)
        this.setState({
            total: t,
            Chosed:arr
        })
        for(let a=0;a<cont.length;a++){
            if(cont[a].year == item.year){
                cont[a].disabled = false;
            }
        }
    }
}
//点击去支付判断
handleJudge(self,Chosed,total){
  if(total/100==0){
    return ""
  }else{
    return self.handleChange(self,Chosed)
  }
}
handleChange(event,Chosed){
  
 
  let pid = this.state.pid.join(',')
  window.location.href="/#/member/payfor?pid="+pid
}
  componentWillMount() {}
  render() {
    let {
      total,
      Chosed,
    } = this.state;
    let {list} = this.props;
    return (
      <div key={1}>
        <div className="Contentbox">
          <div className="Listhead">
            请选择需要的培训计划并支付学费
          </div>

          <Blank blank={ list.length==0 }>
            <div className="Listcon">
              <Row className="Listcon_tit" gutter={24}>

                  <Col span={8}>培训计划名称</Col>
                  <Col span={4}>学分要求 </Col>
                  <Col span={6}>课程有效期</Col>
                  <Col span={3}>价格</Col>
                  <Col span={3}></Col>
              </Row>
              {list
                .map((item, key) => (
                  <Row gutter={24} key={key} className="Listcon_con">

                    <Col span={8} className="Listcon_name"><span>{item.year}</span>{item.name}</Col>
                    <Col span={4} className="Listcon_score">{item.min_score}</Col>
                    <Col span={6} className="Listcon_time">{item.close_time}</Col>
                    <Col span={3} className="Listcon_price">{item.price}元</Col>
                    <Col span={3}>
                      <Checkbox onChange={() => { this.onChange(item,this.props.list) }} disabled={item.disabled} checked={!!item.checked}></Checkbox>
                    </Col>

                  </Row>
                ))}
            </div>
            <p className="Totalprice">总价 :
              <span>{total/100}元</span>
            </p>
            <div className="Payment">
              <p>支付方式</p>

            </div>
            <p className="payfor">
              <Button className="payBtn"
                type="primary"
                onClick={() =>this.handleJudge(this,Chosed,total)}>去支付</Button>
            </p>
          </Blank>
        </div>
      </div>
    )
  }
}
export default Chosetype
