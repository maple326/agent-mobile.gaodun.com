import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Modal, Upload, Avatar, message } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const AutoCompleteOption = AutoComplete.Option


import * as ACTION from 'actions/userinfo'
@connect(
  (state) => { return { state } },
  (dispatch) => bindActionCreators({ ...ACTION }, dispatch)
)
class RegistrationForm extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      data: {},
      updateLoading: false,
      previewImage: '',
      previewVisible: false,
      fileList: [],
      confirmDirty: false,
      autoCompleteResult: [],
      userImg: ''
    }
  }
  setImgPrevList() {

  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          updateLoading: true
        })
        const { userImg } = this.state
        const { userinfo } = this.props.state
        var county_id = ''
        for (let i = 0; i < userinfo.county.length; i ++) {
          if (userinfo.county[i].region_name == values.county_name) {
            county_id = userinfo.county[i].region_id
          }
        }
        
        let obj = Object.assign({}, values, { avatar: userImg, county_id})
        // console.log(obj)
        this.props.updateUserinfo(obj).then((data) => {
          this.setState({
            updateLoading: false
          })
          const { status, info, result } = data.action.payload
          
          if (!status) {
            this.props.getUserinfo()
            Modal.success({
              title: '温馨提示',
              content: '保存成功'
            })
          } else {
            this.props.form.setFields({
              [result.error]: {
                value: values[result.error],
                errors: [new Error(info)]
              }
            });
          }
        })
      }
    });
  }
  handleWillUpload = (file, fileList) => {
    let fileName = file.name
    let reg = /(.(jpg|bmp|gif|jpeg|png)$)/
    
    if (!fileName.match(reg)) {
      file.error = '请选择正确的文件格式！'
      file.status = 'error'
      return false
    }
  }
  handleChange = ({ file, fileList }) => {
    if (file.status == 'done') {
      if (!file.response.status) {
        this.setState({
          userImg: file.response.result.path || ''
        })
      }else {
        file.error = file.response.info
        file.status = 'error'
      }
    }
    this.setState({ fileList: [file] })
  }
  componentDidMount() {
    const { userinfo } = this.props.state
    
    this.setState({
      userImg: userinfo.student ? userinfo.student.avatar : ''
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { userinfo } = this.props.state
    const { updateLoading, autoCompleteResult, condition, value, previewVisible, previewImage, fileList } = this.state
    const actionLink = `//t-new-jxjyadmin.gaodun.com/api/v1/student/upload?token=${userinfo.token}`
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 6 }
      }
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="用户头像:">
          <Avatar className="avatar-img" icon="user" src={this.state.userImg} />
          <Upload
            accept='image/jpg,image/png,image/gif,image/bmp,image/jpeg'
            action={actionLink}
            listType="text"
            fileList={fileList}
            beforeUpload={this.handleWillUpload}
            onChange={this.handleChange}
          >
            <Button>
              <Icon type="upload" /> 上传头像
            </Button>
          </Upload>
        </FormItem>
        <FormItem {...formItemLayout} label="用户姓名:" hasFeedback>
          <Input name="name" value={userinfo.student.name} disabled />
        </FormItem>
        <FormItem {...formItemLayout} label="身份证号:" hasFeedback>
          <Input name="id_number" value={userinfo.student.id_number} disabled />
        </FormItem>
        <FormItem {...formItemLayout} label="手机号码:" hasFeedback>
          {
            getFieldDecorator('mobile', {
              initialValue: userinfo.student.mobile,
              rules: [{
                  required: true,
                  message: '请输入正确的手机号',
                  pattern: /(^[1]{1}[\d]{10}$)/
                }]
            })(<Input type="text" placeholder="请输入你的手机号" />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="E-mail" hasFeedback>
          {
            getFieldDecorator('email', {
              initialValue: userinfo.student.email,
              rules: [{
                  type: 'email',
                  message: '请输入正确的邮箱地址'
                }]
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="所在地区:" hasFeedback>
          {
            getFieldDecorator('county_name', {
              initialValue: userinfo.student.county_name,
              rules: [{
                  required: true,
                  message: '请选择自己所在的区域'
                }]
            })(
              <Select>
                {userinfo.county.map((county, key) => (
                <Option key={key} value={county.region_name}>{county.region_name}</Option>
                ))}
              </Select>)
          }
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={updateLoading}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default WrappedRegistrationForm;
