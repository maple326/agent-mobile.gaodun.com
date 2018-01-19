import axios from 'axios';
import { getEnv } from '../util/config';
import pubsub from './Pubsub';
import Qs from 'qs'
let siteEnv = getEnv();
axios.defaults.baseURL = `//${siteEnv}new-jxjyadmin.gaodun.com/`;
axios.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded";
axios.interceptors.request.use(function (config) {
    let token = localStorage.getItem('token');
    config.headers.common['Authtoken'] = token;
    return Promise.resolve(config);
}, function (error) {
    return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
    if (response.data && response.data.status == '553713665') {
        // 调出登录弹层
        pubsub.publish('login', true)
        return Promise.reject(response.data);
    }
    return Promise.resolve(response.data);
}, function (error) {
    return Promise.reject(error);
});
export default class eduAxios {
    constructor(options = {}) {
        this.options = options;
    }
    request(options) {
        return axios.request(options);
    }
    get(url, options = {}) {
        return this.request({
            url,
            params: {
                ...options
            }
        })
    }
    post(url, data, options = {}) {
        if (data instanceof Object) {
            data = Qs.stringify(data);
        }
        return this.request({
            method: 'post',
            url,
            data,
            ...options
        });
    }
}
const instanceAxios = new eduAxios;
export const request = instanceAxios.request.bind(instanceAxios);
export const get = instanceAxios.get.bind(instanceAxios);
export const post = instanceAxios.post.bind(instanceAxios);