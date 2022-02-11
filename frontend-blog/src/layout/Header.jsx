import './Header.css'

import React from 'react'
import Menu from './Menu'
import Logo from '../components/Logo'
import ToolBar from './ToolBar'

const Header = props => {
    return (
        <header className='Header'>
            <div className='header-title'>
                <Logo />
                <Menu />
            </div>
            <ToolBar/>
        </header>
    )
}

export default Header