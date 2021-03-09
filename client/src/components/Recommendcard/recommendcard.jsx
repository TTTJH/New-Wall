import React,{Component} from 'react'

import './recommendcard.css'

class Recommendcard extends Component{
    render() {
        return (
            <div className="recommend-card">
                <img src="http://www.tttjh.com.cn/imgs/avatar.jpg" alt=""/>
                <div className="recommend-txt-box">
                    <p>爬墙的少年</p>
                    <div className="recommend-tag-box">
                        <span className="tag">萌新</span>
                        <span className="tag">二次元</span>
                        <span className="tag">zzuli</span>
                        <span className="tag">萌新</span>
                        <span className="tag">二次元</span>
                        <span className="tag">zzuli</span>
                        <span className="tag">萌新</span>
                        <span className="tag">二次元</span>
                        {/* <span className="tag">zzuli</span> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Recommendcard