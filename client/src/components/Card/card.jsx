import React,{Component} from 'react'
import { Card, Avatar } from 'antd';
import { EditOutlined, MessageOutlined, LikeOutlined } from '@ant-design/icons';
import "./card.css"

const { Meta } = Card;


class Mycard extends Component{
    componentDidMount(){
      // console.log(this.props)
    }
    render() {
        return (
            <Card
            
            className="card"
            style={{ borderRadius:"10px",margin:"10px" }}
            cover={
              <img
                alt="example"
                // src={this.props.cardImgsArray ? this.props.cardImgsArray[0] : "http://www.tttjh.com.cn/imgs/aaa.png"}
                src="http://www.tttjh.com.cn/imgs/aaa.png"
              />
            }
            actions={[
            <span><LikeOutlined  key="likes"/>&nbsp;&nbsp;</span>,
            <span><MessageOutlined key="comments" />&nbsp;&nbsp;</span>,
            ]}
          >
            <Meta
              avatar={<Avatar src="http://www.tttjh.com.cn/imgs/girl.gif" />}
              title="标题"
              description="描述"
            />
          </Card>
        )
    }
}

export default Mycard