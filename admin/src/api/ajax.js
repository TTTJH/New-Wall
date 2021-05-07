import axios from 'axios'

function ajax(url,type='GET',data={},token=""){
    token ? axios.defaults.headers.common['token'] = token : null
    if(type == 'GET'){// GET请求
        let str = "?"
        Object.keys(data).map((item, index) => {
            str += item+"="+data[item]+"&"
        })
        str = str.slice(0,str.length-1)
        return axios.get(url+str)
    } else {// POST请求
        return axios.post(url,data)
    }
}

export default ajax