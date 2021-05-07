import React,{Component} from 'react'

import shell from 'shelljs'

class Keyword extends Component{
    componentDidMount(){
        
        shell.exec("ls")
    }
    render() {
        return (
            <div>
                <h1>Keyword</h1>
            </div>
        )
    }
}

export default Keyword