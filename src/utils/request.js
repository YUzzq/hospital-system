import axios from 'axios'
import { getToken } from './token'

const http = axios.create({
    baseURL: 'http://192.168.214.47:8080',
    timeout: 20000,
})

http.interceptors.request.use(function (config) {
    config.headers['token']=getToken('token')
    return config;
}, function (error) {
    return Promise.reject(error)
})

http.interceptors.request.use(function (response) {
    return response;
}, function (error) {
    return error
})

export default http