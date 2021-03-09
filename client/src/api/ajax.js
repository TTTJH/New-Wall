import axios from 'axios'

export default function(url,method="GET",data={},token){
    if(method == "GET"){
        if(token){
            axios.defaults.headers.common['token'] = token
        }
        let urlStr = url+"?"
        Object.keys(data).forEach(item => {
            urlStr += item + "=" + data[item] + "&"
        })
        urlStr = urlStr.slice(0,urlStr.length - 1)
        return axios.get(urlStr)
    }else if(method == "POST"){
        if(token){
            axios.defaults.headers.common['token'] = token
        }
        return axios.post(url,data)
    }
}

