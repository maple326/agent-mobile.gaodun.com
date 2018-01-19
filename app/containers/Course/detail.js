import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as courseDetailAction from 'actions/course';
import { Row, Col, Breadcrumb, Icon, Tabs, Button, Tag, Badge, Modal, Select,Radio } from 'antd'

const TabPane = Tabs.TabPane;
const Option = Select.Option;

// 引入自定义组件
import Title from 'components/Title'
import Banner from 'components/Banner'
import Panel from 'components/Panel'
import CourseChapter from 'components/CourseChapter'
import Loading from "components/Loading"

import 'assets/css/courseDetail.less'

let createMarkup = (htmlText) => {
    return {__html: htmlText};
}

function matchStateToProps(state) {
	//...
    return {
        state
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        ...courseDetailAction
    }, dispatch)
}

@connect(matchStateToProps, matchDispatchToProps)

class CourseDetail extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            showVideo:false,//是否弹出视频播放
            videoNum:"0",//当前视频key
            videoName:"",//当前视频名称
            videoId:"",//当前视频id
            player:'',//播放器
            playerTime:600,//当前视频时长
            currentTime:"",//当前视频播放时间
            timer:"",//定时器
            time:0,//记录视频播放时长
            closedVideo:0,//是否关闭
            startTime:0,//开始播放时间
            endTime:0,//视频结束时间
            anitCheatChecked:0,//视频状态
            checkAnswer:"",//选择答案
            sureAnswer:"",//正确答案
            detailLoading:true,
            order_id:"",//订单id
            training_id:"",//培训计划id
            maskShow:false,
            activeShow:false,
            questionShow:false

        }
    }
    componentWillMount() {
        window.s2j_onPlayOver = ()=>{//视频播放结束回调
            this.returnCloseVideo();
        }
        window.s2j_onPlayerInitOver = () =>{//播放器初始化完成回调
            this.returnPlayStatus()  
        }
        // window.s2j_onVideoSeek = (before, after) => {//执行seek时的动作
        //     this.recordPlayingTime(this.state.startTime, before);
        //     this.setState({
        //         startTime:after,
        //         time:0
        //     })
        // }

        window.onbeforeunload = ()=>{
            if(this.props.state.courseVideoList.studentId){
                this.onbeforeunload_handler()
                return ""
            }
        }
        window.onunload = ()=>{
            if(this.props.state.courseVideoList.studentId){
                this.onbeforeunload_handler()
                return ""
            }
        }

        //判断是否从个人中心进入
        const orderId = this.props.location.query.order_id || ""
        const trainingId = this.props.location.query.training_id || ""
            this.setState({
                order_id:orderId,
                training_id:trainingId
            },()=>{
                console.log(orderId)
                this.props.getCourseDetailData({//获取详情数据
                    pkid:this.props.params.id,
                    order_id:this.state.order_id,
                    training_id:this.state.training_id,
                    token:this.props.state.login.result.token
                })
                this.props.getCourseVideoListData({//获取视频列表
                    course_id:this.props.params.id,
                    order_id:this.state.order_id,
                    training_id:this.state.training_id
                }) 
                .then(()=>{
                    this.setState({
                        detailLoading:false
                    })
                })   
            })
    }
    returnDownLoad (){//讲义下载
        window.open(this.props.state.courseDetail.document_path)
    }
    videoInit (){//视频初始化
        this.props.getVideoPathData({
            pkid:this.state.videoId,
            order_id:this.state.order_id,
            training_id:this.state.training_id,
            token:this.props.state.login.result.token
        }).then(()=>{
            this.setState({
                player:polyvObject('#plv_'+ this.props.state.videoPath.videoinfo.video_path).videoPlayer({
                    'width': '820',
                    'height': '460',
                    'vid': this.props.state.videoPath.videoinfo.video_path,
                    'flashvars':{"watchStartTime":this.props.state.videoPath.playdata.lastPlayingTime || 0, "ban_history_time":"on","ban_seek_by_limit_time":"on", "watchEndTime":this.state.playerTime}
                })
            })  
        })
    }
    openVideo (key,val,videoName,videoId,playerTime){//点击播放获取视频资源
            this.setState({
                videoNum:key,
                showVideo: val,
                videoName:videoName,
                videoId:videoId,
                playerTime:playerTime,
                currentTime:0,
                timer:"",
                time:0,
                closedVideo:0,
                startTime:0,
                endTime:0,
                anitCheatChecked:0,
                checkAnswer:"",
            },()=>{
                this.videoInit();
            });
    }
    getCurrentTime(){//获取视频播放当前时间
        let checkTime
        const player = this.state.player
        this.props.state.videoPath.playdata.checkTime ? checkTime = this.props.state.videoPath.playdata.checkTime.split(',') : checkTime = false;
        this.setState({
            startTime:this.props.state.videoPath.playdata.lastPlayingTime
        })
        if(player!=undefined && player.j2s_stayInVideoTime != undefined && player.j2s_realPlayVideoTime != undefined && player.j2s_getDuration != undefined && player.j2s_getFlowCount != undefined && player.j2s_getCurrentTime != undefined){
            this.state.time++
            this.setState({
                currentTime:player.j2s_getCurrentTime()
            })
            if((this.state.time % 5) == 0 && this.state.closedVideo == 0){
                this.returnOpenVideo();
            }
            if (this.state.time == 300) {
                this.recordPlayingTime(this.state.startTime,player.j2s_getCurrentTime());
                this.setState({
                    startTime:player.j2s_getCurrentTime(),
                    time:0
                })
            }
            if(checkTime != false && this.state.anitCheatChecked == 0 && (checkTime[0] == this.state.currentTime || checkTime[1] == this.state.currentTime)){
                this.showQuestion()
            }
            
        }
    }
    getVideoName (val){//下拉列表选择视频
        clearInterval(this.state.timer)
        this.props.getCloseVideoData({
            token:this.props.state.login.result.token
        })
        .then(()=>{
            this.setState({
                closedVideo:1
            },()=>{
                this.recordPlayingTime(this.state.startTime,this.state.player.j2s_getCurrentTime());
                const videoList = this.props.state.courseVideoList.list
                const video = {}
                for (var i in videoList){
                    if(videoList[i].name == val){
                        video.item = videoList[i]
                        video.key = i
                    }
                }
                this.setState({
                    videoNum:video.key,
                    videoName:video.item.name,
                    videoId:video.item.pkid,
                    playerTime:Number(video.item.time_minute)*60 + Number(video.item.time_second),
                    currentTime:0,
                    timer:"",
                    time:0,
                    closedVideo:0,
                    startTime:0,
                    endTime:0,
                    anitCheatChecked:0,
                    checkAnswer:"",
                    questionShow:false,
                    maskShow:false

                },()=>{
                    this.videoInit() 
                });
            })
        })
    
    }
    
    getVideoPlayBoxHeader(name) {//视频弹出层头部
        return <div>
            <span className="video-play-box-header-name">
                {this.props.state.courseVideoList.studentId ? "" : <Tag color='#31cc66' style={{ marginLeft: '10px', borderRadius: '10px',position:'relative',top:"-2px" }}>试听</Tag>}
                {name}
            </span>
            {this.props.state.courseVideoList.studentId ? <Select className="video-play-box-header-sel" value={name} onChange ={(e)=>this.getVideoName(e)}>
                {this.props.state.courseVideoList.list.map((chapter, key) => (
                    <Option key={key} value={chapter.name}>{chapter.name}</Option>
                ))}
                
            </Select>
            :
            <Select className="video-play-box-header-sel" value={name} onChange ={(e)=>this.getVideoName(e)}>
                {this.props.state.courseVideoList.list.map((chapter, key) => (
                    <Option disabled key={key} value={chapter.name}>{key == 0 ? <Tag color='#31cc66' style={{borderRadius:'10px' }}>试听</Tag> : ""} {chapter.name}</Option>
                ))}
                
            </Select>}
        </div>
    }
    closeVideoModal() {//关闭视频弹出层
       if(this.props.state.courseVideoList.studentId){
            clearInterval(this.state.timer)
            this.setState({
                showVideo: false
            },()=>{
                this.props.getCloseVideoData({
                    token:this.props.state.login.result.token
                })
                this.setState({
                    closedVideo:1,
                    currentTime:this.state.player.j2s_getCurrentTime()
                },()=>{
                    this.recordPlayingTime(this.state.startTime,this.state.currentTime);
                })
            })
       }else{
            this.setState({
                showVideo: false
            })
       }
    }
    checkQuestion (e){//选择答案
        this.setState({
            checkAnswer: e.target.value
        },()=>{
            if(this.state.checkAnswer == this.props.state.questionData.answer ){//选择正确继续播放
                this.state.player.j2s_resumeVideo();
                this.setState({
                    questionShow:false,
                    maskShow:false,
                    anitCheatChecked:0,
                    timer:setInterval(()=>{
                        this.getCurrentTime();
                    },1000)
                })
               
            }
        });
    }
    returnOpenVideo (){//打开视频接口
        this.props.getOpenVideoData({
            token:this.props.state.login.result.token
        })
        .then(()=>{
            if(this.props.state.openVideoData.status){
                return true;
            }
        })
    }
    recordPlayingTime (startTime, endTime){//记录学习时长接口
        this.props.getPlayTimeData({
            token:this.props.state.login.result.token,
            video_id:this.state.videoId,
            start_time:startTime,
            end_time:endTime,
            course_id:this.props.params.id,
            order_id:this.state.order_id,
            training_id:this.state.training_id
        })
    }
    showQuestion (){//弹出题目
        const player = this.state.player
        clearInterval(this.state.timer)
        player.j2s_pauseVideo();
        this.props.getQuestionData({//获取防作弊题目
            token:this.props.state.login.result.token
        })
        .then(()=>{
           let sureAnswer
           const answer = this.props.state.questionData.answer
           this.setState({
             anitCheatChecked:1,
             questionShow:true,
             maskShow:true
           })
           if(answer == 1){
                sureAnswer = "A"
           }else if(answer == 2){
            sureAnswer = "B"
            }else if(answer == 3){
                sureAnswer = "C"
            }else if(answer == 4){
                sureAnswer = "D"
            }
            this.setState({
                sureAnswer:sureAnswer
            })
        })
    }
    returnPlayStatus (){//禁止同时播放
        if(!this.props.state.login.result.token){
            return;
        }
        this.props.getPlayStatusData({
            token:this.props.state.login.result.token
        })
        .then(()=>{
           if(this.props.state.playStatusData.status != "0"){
                // this.state.player.j2s_pauseVideo();
                alert("不能同时播放多个视频");
                this.setState({
                    showVideo: false
                })
           }else{
               if(this.props.state.courseVideoList.studentId){
                    this.setState({
                        timer:setInterval(()=>{
                            this.getCurrentTime();
                        },1000)
                    })
               }
           }
        })
    }
    returnCloseVideo (){//视频结束
        clearInterval(this.state.timer)
        if(!this.props.state.courseVideoList.studentId){
           this.setState({
               maskShow:true,
               activeShow:true
           },()=>{
                return;
           })
        }
        const videoinfo = this.props.state.videoPath.videoinfo
        this.setState({
            endTime:videoinfo.time_minute*60+videoinfo.time_second,
            timer:"",
            time:0
        },()=>{
            this.props.getCloseVideoData({
                token:this.props.state.login.result.token
            })
            .then(()=>{
                this.recordPlayingTime(this.state.startTime,this.state.endTime);
                this.setState({
                    startTime:videoinfo.time_minute*60+videoinfo.time_second,
                    time:0,
                    closedVideo:1
                })
            })   
        })
    }
    onbeforeunload_handler (){//即将离开当前页面执行
        clearInterval(this.state.timer)
        this.props.getCloseVideoData({
            token:this.props.state.login.result.token
        })
        .then(()=>{
            this.setState({
                closedVideo:1
            })
            this.recordPlayingTime(this.state.startTime,this.state.player.j2s_getCurrentTime());
        })
        
    }
    render() {
        const radioStyle = {display: 'block',height: '50px',lineHeight: '50px',fontSize:"16px"};
        const {videoNum,videoName} = this.state
        const {pkid,category,category_id,second_id,name,course_image,course_score,document_path,teacher,introduce,study_status} = this.props.state.courseDetail
        const mainClass = category[category_id] || ""//主类
        const twoClass = category[second_id] || ""//副类
        const videoList = this.props.state.courseVideoList.list//视频列表
        const videoPath = this.props.state.videoPath.videoinfo.video_path || ""//视频path
        const token = this.props.state.login.result.token//token
        const question = this.props.state.questionData//问题
        const studentId = this.props.state.courseVideoList.studentId//观看权限
        console.log(this.props.state.courseDetail)
        return (
            <div>
                <Title>{`${name}-高顿继续教育`}</Title>
                <Loading loading={this.state.detailLoading}>
                <div className="courseDetail-introd-hr"></div>
                {/* 课程详情 */}
                <div className="layer-for-body" style={{'overflow': 'hidden'}}>      
                    <div className="layer-for-body-ct">
                        {/* 面包导航 */}
                        <Breadcrumb className="courseDetail-nav" separator={<Icon type="right" />}>
                            <Breadcrumb.Item><Link to='/course'>全部课程</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to={`/course?main=${category_id}`}>{mainClass}</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to={`/course?main=${category_id}&second=${second_id}`}>{twoClass}</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><span>{name}</span></Breadcrumb.Item>
                        </Breadcrumb>
                        {/* 课程简介 */}
                        <Row className="courseDetail-profile">
                            <Col className="courseDetail-profile-img" span={9}>
                                <img src={course_image}/>
                            </Col>
                            <Col className="courseDetail-profile-info" span={15}>
                                <h5>{ name }
                                     <sup>{study_status ? 
                                        <span>
                                            {study_status == 1 ? <Tag color="#31cc66">学习中</Tag> : <Tag color="#31cc66">已学完</Tag> }
                                        </span>
                                        :
                                        ""
                                        }
                                    </sup>
                                </h5>
                                <p>讲师：{ teacher.name }</p>
                                <p>学分：{ course_score }  学分</p>
                                <p>
                                    {studentId && document_path ? <Button onClick = {()=>this.returnDownLoad()} type="primary" size="large" icon="download">讲义下载</Button> : ""}
                                    {studentId ? <Link to={`/course/exam/exercise?cid=${pkid}`}><Button className="ant-btn-blue" size="large" icon="edit">去做练习</Button></Link> : ""}
                                </p>
                            </Col>
                        </Row>
                        {/* 课程详情 */}
                        <Row className="courseDetail-introd">
                            <Tabs defaultActiveKey="1" type="card" onChange={this.callback}>
                                {/* 课程详情 */}
                                <TabPane tab="课程详情" key="1">
                                    <Panel title="课程简介">
                                        <div className="courseDetail-introd-bd" dangerouslySetInnerHTML={createMarkup(introduce)}></div> 
                                    </Panel>
                                    <Panel title="讲师简介">
                                        <Row className="courseDetail-introd-bd">
                                            <Col span={8}>
                                                <img width="262px" src={teacher.avatar} />
                                            </Col>
                                            <Col span={16}>
                                                <h5 className="teacher-name">{teacher.name}</h5>
                                                <p className="teacher-info" dangerouslySetInnerHTML={createMarkup(teacher.profession_title)}></p>
                                                <p dangerouslySetInnerHTML={createMarkup(teacher.introduce)}></p>
                                            </Col>
                                        </Row> 
                                    </Panel>
                                </TabPane>
                                {/* 课程大纲 */}
                                <TabPane tab={<span>课程大纲{studentId == false?<Tag color='#31cc66' style={{ marginLeft: '10px', borderRadius: '10px' }}>试听</Tag>:""}</span>} key="2">
                                    <div className="courseDetail-outline">
                                        {videoList.map((chapter, key) => (
                                            <CourseChapter studentId = {studentId} token = {token} openVideo={this.openVideo.bind(this)} chapter={chapter} index={key} key={key}/>
                                        ))}
                                    </div>
                                </TabPane>
                            </Tabs>
                            
                        </Row>
                    </div>
                </div>

                 <Modal
                    className="video-play-box"
                    title={this.getVideoPlayBoxHeader(videoName)}
                    visible={this.state.showVideo}
                    footer={null}
                    width={900}
                    wrapClassName="vertical-center-modal"
                    maskClosable={false}
                    onCancel={() => this.closeVideoModal()}
                >
                        <div className="video-player">
                            
                           {this.state.showVideo ? <div className = "play-less" id={`plv_${videoPath}`}></div> : ""}
                            
                            
                            {this.state.activeShow ?
                                <div id ="let-active">
                                    <p>试听结束，想继续观看请先激活继续教育培训计划</p>
                                    {token?<Link to="/member/activetrain">去激活</Link>:<Link to="/">激活</Link>}
                                </div>
                                :
                                ""
                            }
                            
                            {this.state.questionShow ?
                                 <div id="question">
                            
                                    <p className = "question-title">{question.title}</p>   
                                    <Radio.Group onChange = {(e)=>this.checkQuestion(e)}>
                                        <Radio style={radioStyle} value={1}>A:{question.option_a}</Radio>
                                        <Radio style={radioStyle} value={2}>B:{question.option_b}</Radio>
                                        <Radio style={radioStyle} value={3}>C:{question.option_c}</Radio>
                                        <Radio style={radioStyle} value={4}>D:{question.option_d}</Radio>
                                    </Radio.Group>

                                    {this.state.checkAnswer != question.answer && this.state.checkAnswer ?
                                        <div className="question-sure">
                                            <div>答案解析：</div>
                                            <p>正确答案是{this.state.sureAnswer}</p>
                                        </div>
                                        :    
                                        ""}
                                    </div>
                                    : ""
                            }
                            {this.state.maskShow?<div id="player-mask"></div>:""}
                        </div>       
                </Modal>
                </Loading>
            </div>
        )
    }
}
export default CourseDetail