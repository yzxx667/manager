// 环境配置封装
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
    dev: {
        baseApi:'/api',
        mockApi:'https://www.fastmock.site/mock/4f2c3030905fe4daef46e12e2cb3609e/api'
    },
    test: {
        baseApi:'//test.futurefe.com/api',
        mockApi:'https://www.fastmock.site/mock/4f2c3030905fe4daef46e12e2cb3609e/api'
    },
    prod: {
        baseApi:'//futurefe.com/api',
        mockApi:'https://www.fastmock.site/mock/4f2c3030905fe4daef46e12e2cb3609e/api'
    }
}
export default {
    env,
    mock: false,
    namespace:'manager',
    ...EnvConfig[env]
}