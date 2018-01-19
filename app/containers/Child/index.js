import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// 引入antd
import { Row, Col, Card, Tag, Icon, Button, Tabs, message } from 'antd';
const CheckableTag = Tag.CheckableTag;
const TabPane = Tabs.TabPane;

// 引入自定义组件
import Title from 'components/Title'
import Banner from 'components/Banner'
import Panel from 'components/Panel'
import ChildCourseList from 'components/CourseList'
import ChildLogin from 'components/Login/ChildLogin'
import Loading from 'components/Loading'
import Blank from 'components/Blank'

// 引入样式文件
import 'assets/css/childIndex.less'

import * as ACTION from 'actions/child';
@connect(
    (state) => { return { state } },
    (dispatch) => bindActionCreators({ ...ACTION }, dispatch)
)
class App extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            bgimg: require("assets/images/childbanner.jpg"),
            yearSelected: '',
            courseSelected: {},
            groupSelected: {},
            page: 1,
            pagesize: 12,
            ifFirst: true,
            loading: true,
            hasMore: true,
            childCourselist: [],
            agencyinfoLoading: true,
            noticeinfoLoading: true,
            coursecategorylistLoading: true
        }
    }
    componentWillMount() {
        const host = location.host
        let env = host.split('-')
        let domain = ''
        
        if (env[0] != 'dev' && env[0] != "t" && env[0] != "pre") {
            domain = env[0]+'-'
        }else {
            domain = env[1]+'-'
        }
        
        // 优先获取站点信息
        this.props.getAgencyinfo({ domain }).then((data) => {
            const { info, result, status } = data.action.payload
            this.setState({
                agencyinfoLoading: false
            })
            if ( !status ) {
                this.props.getNoticeinfos({ agency_id: result.list.pkid }).then(()=> {
                    this.setState({
                        noticeinfoLoading: false
                    })
                });
                this.props.getCoursecategorylist({ agency_id: result.list.pkid }).then((data)=> {
                    const {info, status, result} = data.action.payload
                    const { classify, course, group, year } = result.list

                    this.yearSelectedChange(year[0], true)

                    this.setState({
                        coursecategorylistLoading: false
                    })                    
                });
            }else {
                message.error(info)
            }
            
        })
    }
    yearSelectedChange(year, checked) {
        const { yearSelected } = this.state
        if (yearSelected == year) {
            return;
        }
        const { childCoursecategorylist } = this.props.state.childReducer
        const { course } = childCoursecategorylist
        this.setState({
            yearSelected: year,
            courseSelected: {},
            groupSelected: {}
        }, ()=> {
            this.courseSelectedChange(course[year][0], true)
        })
    }
    courseSelectedChange(course, checked) {
        const { courseSelected } = this.state
        if (courseSelected == course) {
            return;
        }
        this.setState({
            courseSelected: course,
            groupSelected: {}
        }, ()=> {
            this.getChildCourseList(true)
        })
        
    }
    groupSelectedChange(group, checked) {
        const { groupSelected } = this.state
        if (groupSelected.pkid == group.pkid) {
            return;
        }
        this.setState({
            groupSelected: group
        }, ()=> {
            this.getChildCourseList(true)
        })
    }
    getChildCourseList(ifFirst) {
        this.setState({
            loading: true,
            ifFirst
        })
        let { courseSelected, groupSelected, page, pagesize, childCourselist } = this.state
        page = ifFirst ? 1 : page

        this.props.getChildCourselist({
            training_id: courseSelected.pkid,
            group_id: groupSelected.pkid,
            page: ifFirst ? 1 : page,
            pagesize
        }).then((data)=> {
            const {info, status, result} = data.action.payload
            const courseList = ifFirst ? result.list : childCourselist.concat(result.list)
            this.setState({
                loading: false,
                page: page + 1,
                hasMore: !(result.list.length < pagesize),
                childCourselist: courseList
            })
        })
    }
    render() {
        const { bgimg, childCourselist, ifFirst, loading, hasMore,
            yearSelected, courseSelected, groupSelected, 
            agencyinfoLoading, noticeinfoLoading, coursecategorylistLoading} = this.state
        const { agencyinfo, noticeinfos, childCoursecategorylist} = this.props.state.childReducer
        const { course, group, year } = childCoursecategorylist
        const courses = course[yearSelected]
        const groups = group[courseSelected.pkid]
        
        return (
            <div>
                <Title>{`${agencyinfo.name}-会计从业继续教育-高顿继续教育`}</Title>
                {/* banner */}
                <Banner bgimg={bgimg} name={agencyinfo.name}/>
                {/* 通知、常见问题、登录、注册 */}
                <div className="layer-for-body">
                    <div className="layer-for-body-ct">
                        <Row>
                            <Col span={16} className="noticeAndProblem">
                                <Tabs onChange="" type="card">
                                    <TabPane tab={<span>通&nbsp;&nbsp;知</span>} key="1">
                                        <Loading loading={noticeinfoLoading}>
                                            <Blank blank={!noticeinfos.notice.content && !noticeinfoLoading}>
                                                <div className="noticeAndProblem-box">
                                                    <div className="noticeAndProblem-tt">{noticeinfos.notice.title}</div>
                                                    <div className="noticeAndProblem-bd" dangerouslySetInnerHTML={{ __html: noticeinfos.notice.content }}></div>
                                                    <div className="noticeAndProblem-ft">    
                                                        <Link to={`/help/${noticeinfos.notice.pkid}`} target="_blank">
                                                            查看更多<Icon type="arrow-right" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Blank>
                                        </Loading>
                                    </TabPane>
                                    <TabPane tab="常见问题" key="2">
                                        <Loading loading={noticeinfoLoading}>
                                            <Blank blank={!noticeinfos.common_problem.content && !noticeinfoLoading}>
                                                <div className="noticeAndProblem-box">
                                                    <div className="noticeAndProblem-tt">{noticeinfos.common_problem.title}</div>
                                                    <div className="noticeAndProblem-bd" dangerouslySetInnerHTML={{ __html: noticeinfos.common_problem.content }}></div>
                                                    <div className="noticeAndProblem-ft">                                            
                                                        <Link to={`/help/${noticeinfos.common_problem.pkid}`} target="_blank">
                                                            查看更多<Icon type="arrow-right" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Blank>
                                        </Loading>
                                    </TabPane>
                                </Tabs>
                            </Col>
                            <Col span={8}><ChildLogin/></Col>
                        </Row>
                    </div>
                </div>
                {/* 学习流程 */}
                <div className="layer-for-body blueness">
                    <div className="layer-for-body-ct">
                        <Panel title="学习流程" type="white">
                            <Link to={`/help/${noticeinfos.learning_process.pkid}`} target="_blank">
                                <img src={noticeinfos.learning_process.notice_image || require("assets/images/stady-process.png")} 
                                style={{ display: 'block', margin: '50px auto' }} />
                            </Link>
                        </Panel>
                    </div>
                </div>
                {/* 继续教育课程筛选 */}
                <div className="layer-for-body">
                    <div className="layer-for-body-ct">
                        <Panel title="继续教育课程筛选">
                            <Loading loading={coursecategorylistLoading}>
                                <div className="course-classification">
                                    <dl>
                                        <dt>培训年度：</dt>
                                        <dd>
                                            {year.map((y, key) => (
                                                <CheckableTag
                                                    className="course-classification-mainClass"
                                                    key={key}
                                                    checked={yearSelected == y}
                                                    onChange={checked => this.yearSelectedChange(y, checked)}
                                                >
                                                    {y}年
                                                </CheckableTag>
                                            ))}
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>培训名称：</dt>
                                        <dd>
                                            {
                                                courses ? 
                                                    courses.map((course, key) => (
                                                    <CheckableTag
                                                        className="course-classification-subClass"
                                                        key={key}
                                                        checked={courseSelected.pkid == course.pkid}
                                                        onChange={checked => this.courseSelectedChange(course, checked)}
                                                    >
                                                        {course.name}
                                                    </CheckableTag>
                                                ))
                                                : 
                                                    <CheckableTag
                                                        className="course-classification-subClass"
                                                        checked={true}
                                                    >
                                                        全部
                                                    </CheckableTag>
                                            }
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>课程分组：</dt>
                                        <dd>
                                            <CheckableTag
                                                className="course-classification-subClass"
                                                checked={!groupSelected.pkid}
                                                onChange={checked => this.groupSelectedChange({}, checked)}
                                            >
                                                全部
                                            </CheckableTag>
                                            {
                                                groups?
                                                groups.map((group, key) => (
                                                    <CheckableTag
                                                        className="course-classification-subClass"
                                                        key={key}
                                                        checked={groupSelected.pkid == group.pkid}
                                                        onChange={checked => this.groupSelectedChange(group, checked)}
                                                    >
                                                        {group.name}
                                                    </CheckableTag>
                                                ))
                                                : 
                                                '' 
                                            }
                                        </dd>
                                    </dl>
                                </div>
                            </Loading>
                            <Blank blank={!childCourselist.length && !loading}>
                                <ChildCourseList courses={childCourselist} hasMore={hasMore} onClickFun={() => this.getChildCourseList()} loading={loading}/>
                            </Blank>
                        </Panel>
                    </div>
                </div>
            </div>
        )
    }
}
export default App