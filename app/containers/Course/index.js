import React, { Component } from 'react';
import { Tag, Row, Col,Pagination } from 'antd'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as courseAction from 'actions/course';
const CheckableTag = Tag.CheckableTag;

// 引入自定义组件
import Title from 'components/Title'
import Banner from 'components/Banner'
import Panel from 'components/Panel'
import Loading from "components/Loading"
import Blank from "components/Blank"
import ChildCourseList from 'components/CourseList'

import 'assets/css/courseIndex.less'

function matchStateToProps(state) {
	//...
    return {
        state
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        ...courseAction
    }, dispatch)
}
@connect(matchStateToProps, matchDispatchToProps)


class CourseList extends Component {
    constructor(props, context){
        super(props);
        this.state = {
            bgimg: require("assets/images/banner.jpg"),
            pkid:"",//主类id
            subpkid:"",//副类id
            mainClassSelected: '-1',
            subClassSelected: '-1',
            page:1,//当前页
            pagesize:12,//显示列表数量
            classLoading:true,
            courseLoading:true,
            ifFirst: true,
            loading: true,
            hasMore: true,
            childCourselist: []
        }
    }
    componentWillMount() {//获取默认数据
        const main = this.props.location.search.main || ""
        const second = this.props.location.search.second || ""
        this.props.getClassesData()
        .then(()=>{  
            //是否从详情页进入
            if(main){
                this.props.state.classes.first.filter((ele,index,array)=>{
                    if(ele.pkid == main){
                        this.setState({
                            mainClassSelected:index,
                            pkid:main
                        }) 
                    }
                })
            }
            if(second && this.props.state.classes.second[main].length){
                console.log(this.props.state.classes.second[main])
                this.props.state.classes.second[main].filter((ele,index,array)=>{
                    if(ele.pkid == second){
                        this.setState({
                            subClassSelected:index,
                            subpkid:second
                        }) 
                    }
                })
            }
            this.setState({
                classLoading:false
            })
        })
        this.getChildCourseList(true)
    }
    handleAllClassChange() {//点击全部课程，更新列表
        if(this.state.mainClassSelected == "-1"){
            return
        }
        this.setState({
             mainClassSelected:"-1",
             pkid:"",
             page:1,
             subpkid:"",
             subClassSelected:"-1"
        },()=>{
            this.getChildCourseList(true)
        });
    }
    handleMainClassChange(main,key, checked) {//点击主类，更新列表
        if(this.state.mainClassSelected == key){
            return
        }
        this.setState({
             mainClassSelected: key,
             pkid:main.pkid,
             page:1,
             subpkid:"",
             subClassSelected:"-1"
        },()=>{
            this.getChildCourseList(true)
        });
    }
    handleSubClassChange(sub,key, checked) {//点击副类，更新列表
        if(this.state.subClassSelected == key){
            return
        }
        this.setState({
             subClassSelected: key,
             subpkid:sub.pkid,
             page:1
        },()=>{
            this.getChildCourseList(true)
        });
    }
    getChildCourseList(ifFirst) {//获取课程列表数据
        this.setState({
            loading: true,
            ifFirst
        })
        this.props.getCourseListData({
            category_id:this.state.pkid,
            second_id:this.state.subpkid,
            page:this.state.page,
            pagesize:this.state.pagesize
        }).then(()=> {
            let {childCourselist,page,pagesize,ifFirst } = this.state
            const result = this.props.state.courseList.data
            const courseList = ifFirst ? result : childCourselist.concat(result)
            this.setState({
                courseLoading:false,
                loading: false,
                page:page + 1,
                hasMore: !(result.length < pagesize),
                childCourselist: courseList
            })
        })
    }
    render() {
        const { bgimg, mainClassSelected, subClasses, subClassSelected,pkid,hasMore,pagesize,page,childCourselist,ifFirst,loading} = this.state
        const { first,second } = this.props.state.classes
        const mainClasses = first//主类列表
        const twoClasses = second[pkid] || []//副类列表
        return (
            <div>
                <Title>在线课程-会计从业继续教育-高顿继续教育</Title>
                {/* banner */}
                <Banner bgimg={bgimg} />

                {/* 课程分类 */}
                <div className="layer-for-body">
                    <div className="layer-for-body-ct">
                        <Panel title="课程分类">
                            <div>
                                <Loading loading={this.state.classLoading}>
                                <div className="course-classification">
                                    <dl>
                                        <dt>主类：</dt>
                                        <dd>
                                            <CheckableTag
                                                checked={mainClassSelected == "-1"}
                                                className="course-classification-mainClass"
                                                onChange={() => this.handleAllClassChange()}
                                            >
                                                全部课程
                                            </CheckableTag>
                                            {mainClasses.map((main, key) => (
                                                <CheckableTag
                                                    className="course-classification-mainClass"
                                                    key={key}
                                                    checked={mainClassSelected == key}
                                                    onChange={checked => this.handleMainClassChange(main,key, checked)}
                                                >
                                                    {main.name}
                                                </CheckableTag>
                                            ))} 
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>子类：</dt>
                                            {mainClassSelected == "-1"?
                                                <CheckableTag
                                                    checked={subClassSelected == "-1"}
                                                    className="course-classification-mainClass"
                                                >
                                                    全部子类
                                                </CheckableTag>
                                                :
                                                <dd>
                                                    {twoClasses.length?
                                                        twoClasses.map((sub, key) => (
                                                            <CheckableTag
                                                                className="course-classification-subClass"
                                                                key={key}
                                                                checked={subClassSelected == key}
                                                                onChange={checked => this.handleSubClassChange(sub,key, checked)}
                                                            >
                                                                {sub.name}
                                                            </CheckableTag>
                                                        ))
                                                        :
                                                        <span>暂无子类</span>     
                                                    }
                                                </dd>
                                            }
                                    </dl>
                                </div>
                                </Loading>
                                <Blank blank={!childCourselist.length && !loading}>
                                    <ChildCourseList courses={childCourselist} hasMore={hasMore} onClickFun={() => this.getChildCourseList()} loading={loading}/>
                                </Blank>   
                            </div>
                        </Panel>
                    </div>
                </div>
            </div>
        )
    }
}
export default CourseList