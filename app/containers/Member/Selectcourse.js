import React, { Component } from 'react';
import { Button, Tabs, Tag, Table, Row, Col, Checkbox,Modal } from 'antd'
const TabPane = Tabs.TabPane;
const CheckableTag = Tag.CheckableTag;
const confirm = Modal.confirm;
import Blank from '../../components/Blank'
import { Link } from 'react-router'
//引入redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as memberCourse from 'actions/selectcourse'

function matchStateToProps(state) {
	//...
    return {
        state
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        ...memberCourse
    }, dispatch)
}
@connect(matchStateToProps, matchDispatchToProps)


class Selectcourse extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            
            Chosetab: '0',
            currentIndex: '0',
            total: 0,
            checked: false,
            tip:0,//是否是第一次刷新页面获得的数据
            res:[],
            training_id:'',
            course_id:[],
            score:[],
            order_id:'',
            train_flag:false,//选择课程年度培训计划或得的数据是否是空
            



        }
    }
    showConfirm(e) {
        let token = this.props.state.login.result.token;
        let _self =this;
        console.log(_self.state.total)
        if(_self.state.total/10<24.0){
            confirm({
                title: '温馨提示',
                content: '选择学分过低，学分要求在24.0--26.0',
                
                onCancel() { },
            });
        }else if(_self.state.total/10>=24.0 && _self.state.total/10<=26.0){
            confirm({
                title: '温馨提示',
                content: '选择课程后将不能修改，是否确认选择',
                onOk() {
                    console.log("order_id",_self.state.order_id)
                    let key = _self.state.course_id.join(',');
                    let key1 = _self.state.score.join(',');
                    _self.props.SubmitSelectData({
                        training_id:_self.state.training_id,
                        course_id:key,
                        score:key1,
                        token:token,
                        order_id:_self.state.order_id
                    }).then((res) =>{
                        if(res.value.status ==0){
                            window.location.href='/#/member/courselearn'
                        }
                    })
                },
                onCancel() { },
            });
        }else{
            confirm({
                title: '温馨提示',
                content: '选择学分过多，学分要求在24.0--26.0，请重新选择',
                onOk() {
                    
                },
                onCancel() { },
            });
        }
        
    }
    handleChange(key, checked, e ,order_id) {
        this.setState({
            total:0
        })
        let token = this.props.state.login.result.token;
        // console.log(key)
        // console.log(checked)
        // console.log(e)
        // console.log(this);
        
        this.setState({ 
            Chosetab: key,
            tip:e,
            training_id:e,
            order_id:order_id
        })
        this.props.selectListData({
            token:token,
            training_id:e
        }).then((res) => {
            this.setState({
                res:res.value.result.list,
            })
            
        })
    }
    
    
    onChange(item,cont) {
        let t = this.state.total;
        item.checked = !item.checked
        // console.log(item)
        if (item.checked) {
            let arr =this.state.course_id;
            let arrScore = this.state.score;
            arr.push(item.course_id);
            arrScore.push(item.course_score)
            
            this.setState({
                course_id:arr,
                score:arrScore
            })
            // console.log(arrScore)
            t += parseFloat(item.course_score*10);
            this.setState({
                total: t,
            })
            
        } else {
            let arr =this.state.course_id;
            let arrScore = this.state.score;
            let itemIdIndex = 0;
            let itemscoreIndex = 0;
            for (let i = 0; i < arr.length; i ++){
                if(arr[i] == item.course_id) {
                    itemIdIndex = i;
                }
            }
            for (let a=0 ;a<arrScore.length;a++){
                if(arrScore[a] == item.course_score){
                    itemscoreIndex = a
                }
            }
            arr.splice(itemIdIndex, 1)
            arrScore.splice(itemscoreIndex,1)
            this.setState({
                course_id:arr,
                score:arrScore
            })
            t -= parseFloat(item.course_score*10)
            this.setState({
                total: t,
            })
            
        }
     
    }
    // getMessage(e) {
    //     console.log(e)
    // }
    componentWillMount() {
        let token = this.props.state.login.result.token;
        let a = 0;
        this.props.selectCourseData(() =>{
            token:token
        }).then((res) =>{
            console.log('res',res)
            if(res.value.result.list.length == 0){
                this.setState({train_flag:true})
            }else{
                this.setState({train_flag:false})
                a = res.value.result.list[0].pkid;
                this.setState({
                    order_id:res.value.result.list[0].order_id
                })
            }
            //刷新时默认显示，默认是0，点击切换的时候不为0
            if(this.state.tip ==0){
                this.props.selectListData({
                    token:token,
                    training_id:a
                }).then((res) => {
                    if(res.value.status == 0){
                        
                        this.setState({
                            res:res.value.result.list,
                        })
                    }else{
                        this.setState({
                            res:[],
                        })
                    }
                })
                this.setState({
                    training_id:a
                })
            }
        })
    
    }
    componentDidMount(){
        
    }

    render() {
        const { tit, cont, Chosetab, data, columns, checked, total ,res,train_flag } = this.state;
        const CourseTit =this.props.state.SelectCourseList.list;
        // const Coursecon = this.props.state.SelectListData.list;
        // console.log(this.state.tip)    
        
        

        return (
            <div key={3}>
                <div className="Selectcourse">
                    <div className="Selecttit">
                        请选择课程
                    </div>
                    <Blank blank={ train_flag== true} getText="你还没有可选择的课程 先去激活培训计划吧" getGo="去激活">
                        {CourseTit.map((item, key) => (
                            <CheckableTag
                                key={key}
                                className="Selecttab"
                                checked={Chosetab == key}
                                onChange={checked => this.handleChange(key, checked,item.pkid,item.order_id)}
                                onClick={checked => this.getMessage(e)}
                                
                            >
                                <span>{item.name}</span>
                        <span>({item.min_score}-{item.max_score})学分</span>
                            </CheckableTag>

                        ))}
                        <div className="Selectcon">
                            {res.map((item, key) => (
                                <Row gutter={24} key={key}>
                                    <Col span={8} key={key + 2} className="Select_name" title={item.course_name}>{item.course_name}</Col>
                                    <Col span={5} key={key + 3} className="Select_kind">[{item.category_name}]</Col>
                                    <Col span={4} key={key + 4} className="Select_teacher" title={item.teacher_name}>讲师:{item.teacher_name}</Col>
                                    <Col span={5} key={key + 5} className="Select_score">{item.course_score} 学分</Col>
                                    <Col span={2} key={key + 6}><Checkbox onChange={() => { this.onChange(item,cont) }} disabled={item.disabled} checked={!!item.checked}></Checkbox></Col>
                                </Row>
                            ))}
                        </div>
                        <p className="Selectscore">已选学分:<span>{this.state.total/10} 学分</span></p>
                        <p className="Selectbtn"><Button type="primary" htmlType="submit" onClick={() => this.showConfirm(this)}>确认选课</Button></p>
                    </Blank>







                </div>
            </div>
        )
    }
}
export default Selectcourse