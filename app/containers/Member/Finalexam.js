import React, {Component} from 'react';
import {
  Button,
  Checkbox,
  Tag,
  Row,
  Col,
  Table,
  Modal
} from 'antd'
const CheckableTag = Tag.CheckableTag;
import Blank from '../../components/Blank'
import {Link} from 'react-router-dom'

//引入redux

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as examAction from 'actions/finalexam';
function matchStateToProps(state) {
  //...
  return {state}
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    ...examAction
  }, dispatch)
}
@connect(matchStateToProps, matchDispatchToProps)

class Finalexam extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      performance: [
        {
              title: '考试时间',
              dataIndex: 'create_time',
              key: 'create_time'
            }, {
              title: '考试成绩',
              dataIndex: 'result_score',
              key: 'result_score'     
        }
      ],
      Chosetab: '0',
      pagination: false,
      active: [],//终极测试active内容
      activeCon:[],//active 显示在列表的内容
      activeList:[],//active 显示在全部成绩的内容
      history:[],//终极测试 history 内容
      flag:0,//tab切换的下表
      doFlag:true//判断是否可以眺望去考试
    }
  }
  handleChange(key, checked) {
    const {Chosetab} = this.state;
    this.setState({Chosetab: key});
    this.setState({
      activeCon:this.state.active[key],
      flag:key,
      activeList:this.state.active[key].exam_list
    },() =>{
      let require_score = Number(this.state.activeCon.require_score);
      let student_score = this.state.activeCon.student_score;
      let score = require_score-student_score;
      if(score ==0){
        this.setState({
          doFlag:false
        })
      }
    })
  }
  info() {
    let title = this.state.activeCon.training_name;
    let examtime = this.state.performance;
    
    const {pagination,activeList} = this.state;
    Modal.info({title: title, content: (
        <div>
          <Table
            columns={examtime}
            dataSource={activeList}
            bordered={true}
            pagination={pagination}/>
        </div>
      ), onOk() {}})

  }
  info2(training_name,exam_list) {
    let title = training_name;
    let examtime = this.state.performance;
    
    const {pagination} = this.state;
    Modal.info({title: title, content: (
        <div>
          <Table
            columns={examtime}
            dataSource={exam_list}
            bordered={true}
            pagination={pagination}/>
        </div>
      ), onOk() {}})

  }
  doExam(score,order_id){
    
      window.location.href=`/#/course/exam/examine?eid=${score}&oid=${order_id}`;
    
  }
  
  componentWillMount() {
    let { flag } =this.state;
    let token = this.props.state.login.result.token;
    const history =this.state;
      this.props.GetExamData({
        token: token
      }).then((res) => {
        console.log('res',res);
        //active ==null时
        if(res.value.result[0].active ==null){
          this.setState({active:[]})
        }else{
          let arr=[];
          for( let i in res.value.result[0].active){
            arr.push(res.value.result[0].active[i])
          }
          this.setState({
            active: arr,
          })
          //首次刷新页面 active不为【】
          if(flag == 0){
            this.setState({
              activeCon:this.state.active[flag],
              activeList:this.state.active[flag].exam_list
            },() =>{
              let require_score = Number(this.state.active[flag].require_score);
              let student_score = this.state.active[flag].student_score;
              let score = require_score - student_score;
              if(score==0){
                this.setState({
                  doFlag:false
                })
              }
            })
            
          }
        }
        
        //history ==null 时
        if(res.value.result[0].history==null ){
          this.setState({history:[]})
        }else{
          this.setState({
            history: res.value.result[0].history,
          })
        }
        
      })
  }
  componentDidMount() {}
  render() {
    const {
      tit,
      Chosetab,
      columns,
      data,
      columns2,
      active,
      activeCon,
      history,
      doFlag
    } = this.state;
    let arr = new Array()
    arr[0]=activeCon;
    
    

    return (
      <div key={4}>
        <div className="Finalexam">
          <div className="Examtit">
            终极考试
          </div>
          <Blank blank={active.length==0} getText="你还没有可参加的测评 先去激活培训计划吧" getGo="去激活">
            <div className="Examyear">
              培训年度 {active.map((item, key) => (
                <CheckableTag
                  className="Choseyear"
                  checked={Chosetab == key}
                  key={key}
                  onChange={checked => this.handleChange(key, checked)}>{item.year}年</CheckableTag>
              ))}

            </div>
            <Row gutter={24} className="celltit">
              <Col span={6}>培训计划名称</Col>
              <Col span={3}>学分要求</Col>
              <Col span={3}>已获得学分</Col>
              <Col span={3}>合格分数</Col>
              <Col span={3}>可考试次数</Col>
              <Col span={6}>最高成绩</Col>
            </Row>
            <Row gutter={24} className="cellcon">
              <Col span={6} className="Examname"><span className="Examtype">{activeCon.year}</span> {activeCon.training_name}</Col>
              <Col span={3}>{activeCon.require_score}</Col>
              <Col span={3}><span className="Examscored">{activeCon.student_score}</span></Col>
              <Col span={3}>{activeCon.pass_score}</Col>
              <Col span={3}>{activeCon.last_times}</Col>
              <Col span={6}><span className="Hightscore">{activeCon.max_result}</span>
              <Button
                  type="primary"
                  onClick={this
                  .info
                  .bind(this)}>全部成绩
              </Button>
              </Col>
            </Row>
            <Button type="primary" 
            onClick={() =>this.doExam(activeCon.exam_id,activeCon.order_id)} 
            className="Gotext"
            disabled={doFlag}
            >
            去考试
            </Button>
          </Blank>
        </div>
        <div className="Finalexamed">
          <div className="Examtit">
            历史记录
          </div>
          <Row gutter={24} className="celltit">
            <Col span={6}>培训计划名称</Col>
            <Col span={3}>学分要求</Col>
            <Col span={3}>已获得学分</Col>
            <Col span={3}>合格分数</Col>
            <Col span={5}>购课时间</Col>
            <Col span={4}>最高成绩</Col>
          </Row>
          { history.map((item,key) =>(
            <Row gutter={24} className="cellcon" key={key}>
              <Col span={6} className="Examname"><span className="Examtype">{item.year}</span> {item.training_name}</Col>
              <Col span={3}>{item.min_score}</Col>
              <Col span={3}><span className="Examscored">{item.student_score}</span></Col>
              <Col span={3}>{item.pass_score}</Col>
              <Col span={5}>{item.pay_time}</Col>
              <Col span={4}><span className="Hightscore">{item.max_result}</span>
              <Button
                  type="gray"
                  onClick={() =>this.info2(item.training_name,item.exam_list)}>全部成绩
              </Button>
            </Col>
          </Row>
          ))}
          
        </div>

      </div>
    )
  }
}
export default Finalexam
