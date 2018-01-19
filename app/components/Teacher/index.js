import React, { Component } from 'react'
import { Card } from 'antd';
import './teacher.less'

class CourseItem extends Component {
    constructor(props, context) {
        super(props);
        this.state = {

        }
    }
    componentWillMount() {

    }
    render() {
        var { children, teacher } = this.props;
        return (
            <Card className="teacher-item-bd" bodyStyle={{ padding: 0 }}>
                <div className="teacher-image">
                    <img alt={teacher.name} width="100%" src={teacher.avatar} />
                </div>
                <div className="custom-card">
                    <h5>{teacher.name}</h5>
                    <div dangerouslySetInnerHTML={{__html: teacher.introduce}}></div>
                </div>
            </Card>
        )
    }
}

export default CourseItem;