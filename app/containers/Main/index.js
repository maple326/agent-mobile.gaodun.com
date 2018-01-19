import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// 引入antd
import { Row, Col, Card, Tag, Icon, Button, Carousel } from 'antd';
const CheckableTag = Tag.CheckableTag;

// 引入自定义组件'
import Title from 'components/Title'
import Banner from 'components/Banner'
import Panel from 'components/Panel'
import CourseItem from 'components/CourseItem'
import Teacher from 'components/Teacher'
import Loading from "components/Loading"

// 引入样式文件
import 'assets/css/mainIndex.less'
let SampleNextArrow = props => {
    const { className, style, onClick } = props
    return (
        <div
            className={className}
            style={{ ...style, display: 'block' }}
            onClick={onClick}
        >
            <Icon type="right" style={{ fontSize: 20, verticalAlign: 'middle' }} />
        </div>
    );
}

let SamplePrevArrow = props => {
    const { className, style, onClick } = props
    return (
        <div
            className={className}
            style={{ ...style, display: 'block' }}
            onClick={onClick}
        >
            <Icon type="left" style={{ fontSize: 20, verticalAlign: 'middle' }} />
        </div>
    );
}

// 引入action
import * as ACTION from 'actions/main';
@connect(
    (state) => { return { state } },
    (dispatch) => bindActionCreators({ ...ACTION }, dispatch)
)
class App extends Component {
    constructor(props, context){
        super(props);
        this.state = {
            bgimg: require("assets/images/banner.jpg"),
            provinceArrow: true,
            selectedProvince: {},
            selectedCity: 'NaN',
            regionLoading: true,
            teacherLoading: true,
            courseLoading: true
        }
    }
    componentWillMount(){
        // 加载教育学区
        this.props.getRegions().then((data)=> {
            const {info, status, result} = data.action.payload
            this.handleProvinceChange(result.list.province[0])
            this.setState({
                regionLoading: false
            })
        })
        this.props.getTeachers().then((data)=> {
            this.setState({
                teacherLoading: false
            })
        })
        this.props.getCourses().then(()=> {
            this.setState({
                courseLoading: false
            })
        })
    }
    handleProvinceChange(province, checked) {
        const { selectedProvince } = this.state
        if (selectedProvince == province) {
            return
        }
        this.setState({ selectedProvince: province });
    }
    handleCityChange(city, checked) {
        const { selectedCity } = this.state
        if ( selectedCity == city ) {
            return
        }
        this.setState({ selectedCity: city });
    }
    handleProvinceArrow() {
        const { provinceArrow } = this.state;
        this.setState({provinceArrow: !provinceArrow });
    }
    goIntoStadyArea() {
        const { selectedCity } = this.state;
        const { agency } = this.props.state.regions
        if (selectedCity) {
            let hostPrev = agency[selectedCity.region_id]
            let host = location.host
            let ifNew = host.indexOf("new-") > -1
            let env = ifNew ? host.split("new-")[0] : host.split("jxjy")[0]
            
            if (ifNew) {
                if (env == 'dev-') {
                    window.location.href = `http://${env}${hostPrev}new-jxjy.gaodun.com:8080/`
                } else {
                    window.location.href = `http://${env}${hostPrev}new-jxjy.gaodun.com/`
                }
            }else {
                if (env == 'dev-') {
                    window.location.href = `http://${env}${hostPrev}jxjy.gaodun.com:8080/`
                } else {
                    window.location.href = `http://${env}${hostPrev}jxjy.gaodun.com/`
                }  
            }  
        }
    }
    render() {
        const { bgimg, provinceArrow, selectedCity, selectedProvince, regionLoading, teacherLoading, courseLoading } = this.state;
        const { province, city } = this.props.state.regions
        const teachers = this.props.state.teachers.list
        const courses = this.props.state.courses.list
        const cityShow = city[selectedProvince.region_id] || []
    
        console.log(cityShow)
        
        return (
            <div>
                <Title>会计从业继续教育-高顿继续教育</Title>
                {/* banner */}
                <Banner bgimg={bgimg}/>
                {/* 请选择您继续教育的地区 */}
                <div className="layer-for-body">
                    <div className="layer-for-body-ct">
                        <Panel title="请选择您继续教育的地区">
                            <Loading loading={regionLoading}>
                                <div className="select-area">
                                    <dl>
                                        <dt>省/直辖市：</dt>
                                        <dd className={!provinceArrow ? "" : "provinceShowLess"}>
                                            {province.map( (prov, key) => (
                                                <CheckableTag
                                                    className="select-area-province"
                                                    key={key}
                                                    checked={selectedProvince.region_id == prov.region_id}
                                                    onChange={checked => this.handleProvinceChange(prov, checked)}
                                                >
                                                    {prov.region_name}
                                                </CheckableTag>
                                            ))}
                                        
                                            {province.length > 10 
                                                ? <span className="select-area-arrw" onClick={() => this.handleProvinceArrow()}>
                                                    {!provinceArrow 
                                                        ? <Icon className="select-area-icon" type="double-left" style={{ fontSize: 16, marginRight: 8 }}/> 
                                                        : <Icon className="select-area-icon" type="double-right" style={{ fontSize: 16, marginRight: 8 }}/>}
                                                    {!provinceArrow ? "收起" : "展开"}
                                                </span>
                                                : ''
                                            }
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>市：</dt>
                                        <dd>
                                            {cityShow.map( (tag, key) => (
                                                <CheckableTag
                                                    className="select-area-city"
                                                    key={key}
                                                    checked={selectedCity.region_id == tag.region_id}
                                                    onChange={checked => this.handleCityChange(tag, checked)}
                                                >
                                                    {tag.region_name}
                                                </CheckableTag>
                                            ))}
                                        </dd>
                                    </dl>
                                    <div className="select-area-over">
                                        <Button className="select-area-over-btn" disabled={!selectedCity.region_id ? true : false} onClick={() => this.goIntoStadyArea()} type="primary">进入教育地区</Button>
                                    </div>
                                </div>
                            </Loading>
                        </Panel>
                    </div>
                </div>
                {/* 免费试听课程推荐 */}
                <div className="layer-for-body blueness">
                    <div className="layer-for-body-ct">
                        <Panel title="免费试听课程推荐" type="white" hdRight="更多课程" hdRightLink="/course">
                            <Loading loading={courseLoading}>
                                <Row gutter={24} className="course-free">
                                    {courses.map( (course, key) => (
                                        <Col span={8} key={key}>
                                            <CourseItem course={course} />
                                        </Col>
                                    ))}
                                </Row>
                            </Loading>
                        </Panel>
                    </div>
                </div>
                {/* 高顿名师 */}
                <div className="layer-for-body">
                    <div className="layer-for-body-ct">
                        <Panel title="高顿名师">
                            <Loading loading={teacherLoading}>
                                <Carousel className="teacher-list" dots={false} arrows slidesToShow={4} slidesToScroll={4} nextArrow={<SampleNextArrow />} prevArrow={<SamplePrevArrow />}>
                                    {teachers.map( (teacher, key) => (
                                        <div className="teacher-item" key={key}>
                                            <Teacher teacher={teacher}/>
                                        </div>
                                    ))}
                                </Carousel>
                            </Loading>
                        </Panel>
                    </div>
                </div>
            </div>
        )
    }
}
export default App