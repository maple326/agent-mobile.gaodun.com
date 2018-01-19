import React, {Component} from 'react';
import {Button, Menu, Icon, Table, Tabs ,Checkbox} from 'antd'
import {Link} from 'react-router'
import pubsub from '../../util/Pubsub'

const TabPane = Tabs.TabPane;

//引入组件
import Jiechild from './Jiechild'
import Checklist from './Checklist'

import * as memberAction from 'actions/member';
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux';

function matchStateToProps(state) {
    return {
        state
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        ...memberAction
    }, dispatch)
}
@connect(matchStateToProps, matchDispatchToProps)

class Payfor extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      data: {},
      clumns: [
        {
          title: '培训计划名称 ',
          dataIndex: 'name',
          key: 'name'
        }, {
          title: '价格(元)',
          dataIndex: 'price',
          key: 'price'
        }
      ],
      
      sum: 0,
      flag1:true,
      flag2:false,
      training_id:'',
      checked:false,
      payType:"alipay",
      bankCode:'',
      condition:true,
      values:{},
      key:0,
      arry:[]//在payfor页面显示培训计划
    }

  }
  checkPay(){
    this.setState({
      flag1:true,
      flag2:false,
      payType:"alipay"
    })

  }
  checkJie(){
    this.setState({
      flag1:false,
      flag2:true,
      payType:"debitcard"
    })
  }
  handleKey(bankCode){
    this.setState({
      bankCode:bankCode
    })
  }
  onChange(e){
    console.log(`checked = ${e.target.checked}`);
  }
  handlePub(){
    
    pubsub.publish('handleSubmit')
    pubsub.subscribe('returnValue',(data) =>{
      this.setState({data:data})
      if(data.key==1){
        this.setState({
          condition : !this.state.condition,
          values:data.values,
          key:data.key
        },()=>this.handlePort(data.values)
        )
      }
    })
    
    
  }
  handleSubmit (){
    const {condition,values ,checked ,key,data} = this.state
    
      if(checked==true){
        this.handlePub()
      }else{//不要发票
        this.props.confirmPay({
        amount : this.state.sum,
        invoice_status:1,
        training_id : this.state.training_id,
        payType : this.state.payType,
        token:this.props.state.login.result.token,
        bankCode:this.state.bankCode
      }).then((res) =>{
        console.log(res.value)
        if(res.value.status == 0){
          console.log('success1')
          window.location.href = res.value.result;
        }
      })
    }
    
    //选择要发票且发票格式正确
    
}
  handlePort(values){
        if(values.invoice_type==1){//个人
          this.props.confirmPay({
          amount : this.state.sum,
          invoice_status:2,
          training_id : this.state.training_id,
          payType : this.state.payType,
          token:this.props.state.login.result.token,
          bankCode:this.state.bankCode,
          invoice_title:values.invoice_title,//姓名
          email:values.email,//邮箱
          invoice_type:values.invoice_type,//个人
          remark:values.remark//备注
        }).then((res) =>{
          console.log(res.value)
          if(res.value.status == 0){
            console.log('success2')
            window.location.href = res.value.result;
          
          }
        })
        }else if(values.invoice_type==2){//公司
          this.props.confirmPay({
            amount : this.state.sum,
            invoice_status:2,
            training_id : this.state.training_id,
            payType : this.state.payType,
            token:this.props.state.login.result.token,
            bankCode:this.state.bankCode,
            invoice_title:values.companyName,//公司名称
            taxpayer_account:values.taxpayer_account,//纳税人识别号
            email:values.email,//邮箱
            invoice_type:values.invoice_type,//公司
            company_address:values.company_address,//公司地址
            company_bank:values.company_bank,//公司开户银行
            company_bank_code:values.company_bank_code,//公司银行账户
            company_mobile:values.company_mobile,//公司固定电话
            remark:values.remark
          }).then((res) =>{
            if(res.value.status == 0){
                console.log('success3')
                window.location.href = res.value.result;
              
            }
          })
        }
      
  }
  handleCheck (e){
      console.log(e.target.checked);
      this.setState({
        checked : e.target.checked
      })
  }
  handleBack(){
    window.history.go(-1)
  }
  componentWillMount() {
    //通过url获取培训计划数据
    let query = this.props.location.query;
    let arr =[];
    let arrs=[];
    if(query){
      // console.log(query)
      let arr=query.pid.split(",")
      let token = this.props.state.login.result.token;
      this.props.getActiveListdata(() =>{
        token:token
      }).then((data) =>{
        data.value.result.list.filter((ele,inde) =>{
          for( let a in arr){
            if(ele.pkid==arr[a]){
              arrs.push(ele)
            }
          }
            
        })
      }).then(()=>{
        this.setState({arry:arrs})
        let t = 0;
          for (let i = 0; i < arrs.length; i++) {
            t += Number(arrs[i].price)
          }
          this.setState({sum: t})
          let arry = [];
          for( let a=0; a< arrs.length ; a++){
            arry.push(arrs[a].pkid)
          }
          let str = arry.join(",")
          this.setState({
            training_id : str
          })    
      })
      
    }
  }
  componentDidMount() {
    
    

  }
  render() {
    const {clumns, data, sum,flag1,flag2,arry,checked} = this.state;
    const token = this.props.state.login.result.token;
    

    return (
      <div>
        <div className="PayContent">
            <p className="goback" onClick={() =>this.handleBack()}>
              <Icon type="arrow-left"/>
              <span>返回选择课程</span>
            </p>
            <p className="Paytit">请选择付款方式</p>
            <p className="Paylist">* 培训清单</p>
            <Table columns={clumns} dataSource={arry}/>
            <p className="sum">总价:<span>{sum}元</span>
            </p>
            <div className="Payway clearfix">
            <p className="Paytit">*支付方式</p>
           
            <span className={ flag1 ? "payed_for" :"pay_for"} onClick={this.checkPay.bind(this)}></span>
            <span className={ flag2 ? "jied_for" : "jie_for"} onClick={this.checkJie.bind(this)}></span>
           
            
            
          </div>
          <div className="Showbank clearfix">
            {flag2 ? <Jiechild handleKey={this.handleKey.bind(this)}/> : ""}
          </div>
          <p className="goPay clearfix">
            <Button className="doPay" onClick={()=>{this.handleSubmit()}}>立即支付</Button>
            
          </p>
          <p className="checkBox clearfix">
            <Checkbox className="docheck" onChange = { (e) =>{this.handleCheck(e)}}>是否需要发票</Checkbox>
          
          </p>
          {checked ? <Checklist/> : ""}
          

        </div>

      </div>

    )
  }
}
export default Payfor
