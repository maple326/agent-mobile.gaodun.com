import {post, get} from '../util/eduAxios';

//获取最终测试结果列表
export const getexamdata = params => post('api/v1/examine/examList',params);