import React, { Component } from 'react'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,Option } from 'antd';
import pubsub from '../../util/Pubsub';

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;
const SelectOption = Select.Option



class RegistrationForm extends React.Component {
  constructor(props,context) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      flag:1
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.validate();
  }
  handleSelectChange(e){
    console.log(e)
    this.setState({
      flag : e,//判断是个人还是公司  1：个人 2：公司
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  validate(){
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  componentDidMount(){
    
  }
  componentWillMount() {
    pubsub.subscribe('handleSubmit', () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          let key=1;
          pubsub.publish('returnValue',{key,values})
        }
      });
    })
  }
  render() {
    const { getFieldDecorator  } = this.props.form;
    const { flag } =this.state;
    const formItemLayout ={
      labelCol:{ span: 3 },
      wrapperCol:{ span: 10 }
    }
    return (
      <Form className="FormList" onSubmit={this.handleSubmit}>
        <FormItem label="发票类型"  {...formItemLayout}>
          {getFieldDecorator('invoice_type', {
            rules: [{ required: true, message: '请选择你需要的发票类型!' }],
          })(
            <Select placeholder="请选择你需要的发票类型" onChange={this.handleSelectChange.bind(this)}>
              <SelectOption value="1">个人</SelectOption>
              <SelectOption value="2">公司</SelectOption>
            </Select>
          )}
        </FormItem>
        <FormItem label="邮箱"  {...formItemLayout}>
          {getFieldDecorator('email', {
            rules: [{
              required: true, message: '请输入正确的邮箱',
              pattern: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
            }],
          })(
            <Input type="email" placeholder='请输入邮编'/>
          )}
        </FormItem>
        
        { flag == "1" ?
          <FormItem label="姓名"  {...formItemLayout}>
            {getFieldDecorator('invoice_title', {
              rules: [{
                required: true, message: '请输入姓名',
              }],
            })(
              <Input type="text" placeholder='请输入姓名'/>
            )}
          </FormItem>
        :
        <div>
          <FormItem label="公司全称"  {...formItemLayout}>
            {getFieldDecorator('companyName', {
              rules: [{
                required: true, message: '请输入公司全称',
              }],
            })(
              <Input type="text" placeholder='请输入公司全称'/>
            )}
          </FormItem>
          <FormItem label="纳税人识别号"  {...formItemLayout}>
            {getFieldDecorator('taxpayer_account', {
            })(
              <Input type="text" placeholder='确认无纳税人识别号可以不填写'/>
            )}
          </FormItem>
          <FormItem label="公司注册地址"  {...formItemLayout}>
            {getFieldDecorator('company_address', {
            })(
              <Input type="text" placeholder='非必填'/>
            )}
          </FormItem>
          <FormItem label="公司银行开户行"  {...formItemLayout}>
            {getFieldDecorator('company_bank', {
            })(
              <Input type="text" placeholder='非必填'/>
            )}
          </FormItem>
          <FormItem label="公司银行账号"  {...formItemLayout}>
            {getFieldDecorator('company_bank_code', {
            })(
              <Input type="text" placeholder='非必填'/>
            )}
          </FormItem>
          <FormItem label="公司固定电话"  {...formItemLayout}>
            {getFieldDecorator('company_mobile', {
            })(
              <Input type="text" placeholder='非必填'/>
            )}
          </FormItem>
        </div>
        }

        
        
        <FormItem label="备注"  {...formItemLayout}>
          {getFieldDecorator('remark', {
            rules: [{
              required: false
              
            }],
          })(
            <Input type="textarea" rows="3" cols="20"/>
          )}
        </FormItem>
      </Form>
    );
  }
}

 const Checklist = Form.create()(RegistrationForm);
 export default Checklist