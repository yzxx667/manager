// Storage 二次封装

import config  from "../config"

export default {
    setItem(key,val){
        let storage = this.getStorgae();
        storage[key] = val;
        window.localStorage.setItem(config.namespace,JSON.stringify(storage))
    },
    getItem(key){
        return this.getStorgae()[key]
    },
    getStorgae(){
        return JSON.parse(window.localStorage.getItem(config.namespace) || "{}")
    },
    clearItem(key){
        let storage = this.getStorgae()
        delete storage[key]
        window.localStorage.setItem(config.namespace,JSON.stringify(storage))
    },
    clearAll(){
        window.localStorage.clear()
    }
}