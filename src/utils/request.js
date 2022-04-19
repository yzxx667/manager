// axios二次封装
import axios from "axios"
import config from "../config"
import { ElMessage } from 'element-plus' 
import router from './../router/index.js'
import storage from "./storage"
const TOKEN_INVALID = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

// 创建axios实例对象，添加全局配置 
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req)=>{
    // TO_DO

    // token
    const headers = req.headers;
    const { token } = storage.getItem('userInfo')
    if( !headers.Authorization) headers.Authorization = 'Bearer ' + token
    return req
})

// 响应拦截
service.interceptors.response.use((res)=>{
    const { code, data, msg} = res.data;
    if(code === 200){
        return data
    }else if(code === 500001){
        ElMessage.error(TOKEN_INVALID)
        setTimeout(() => {
            router.push('/login')
        }, 1500);
        return Promise.reject(TOKEN_INVALID)
    }else{
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

//请求的核心函数
function request(options){
    options.methods = options.methods || 'get'
    if(options.methods.toLowerCase() === 'get'){
        options.params = options.data
    }
    // 局部mock
    let isMock = config.mock
    if(typeof options.mock != 'undefined'){
        isMock = options.mock
    }

    if(config.env === 'prod'){
        service.defaults.baseURL = config.baseApi
    }else{
        service.defaults.baseURL = isMock ? config.mockApi:config.baseApi
    }
    // console.log(options)
    return service(options)
}

['get','post','put','delete','patch'].forEach( (item)=>   {
    request[item] = (url,data,options)=>{
        return request({
            url,
            data,
            method:item,
            ...options
        })
    }
})

export default request