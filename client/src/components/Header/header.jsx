import React,{useState} from 'react'

import './header.css'

const Header = () => {
    return (
        <div className="header">
            <div className="yellow-header"></div>
            <div className="main-header">
                    <div className="web-title">
                    <img className="logo" src="logo.png" alt=""/>
                    <span>ZZULI-WALL</span>
                    </div>
                    <ul className="main-header-item">
                           <li>item1</li>
                           <li>item2</li>
                           <li>item3</li> 
                    </ul>
            </div>
        </div>
    )
}

export default Header