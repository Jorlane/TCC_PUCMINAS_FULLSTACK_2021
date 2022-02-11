import './ToolBar.css'

import React, { useContext } from 'react'
import {Link} from 'react-router-dom'
import { AppContext } from '../data/Store'
import { IMAGE_URL_API, IMAGE_PROFILE_DEFAULT } from '../data/Consts'

const ToolBar = props => {

    const {showModal, closeModal, user, profileLoggedUser, toolBarContent} = useContext(AppContext)

    function showMenuModal(e) {
        let leftMenuAdmin = e.pageX - 300
        if (leftMenuAdmin < 0) {
            leftMenuAdmin = 10
        }
        const style = {
            left: leftMenuAdmin + 'px', 
            width: '300px'
        }

        const menuAdmin =
                <ul  id="menu-admin" style={style}>
                    <li className='menu-option'><Link to="categories" onClick={closeModal}>Categorias</Link></li>
                    <li><a href="/">Denúncias</a></li>
                    <li><a href="/">Usuários Bloqueados</a></li>
                </ul>

        showModal(menuAdmin)
    }

    function handleClickGoBack() {
        const history = window.history
        history.back()
    }

    if (!toolBarContent) {
        const location = window.location.pathname
        
        console.log('location ===> ', location)
        return (
            <div className='ToolBar'>
                <div className='user-greetings'>
                    <button className={`button-back-toolbar button_icon ${(user.validToken && location!=='/')? 'active' : ''}`} onClick={handleClickGoBack}>
                        <span className='material-icons-outlined'>
                            arrow_back
                        </span>
                    </button>
                    <div className={`user-name ${user.validToken ? 'active' : ''}`}>
                        <span>Olá {user.name}! <Link className='text-link-exit' to="logout">(Sair)</Link></span> 
                    </div>
                    <div className={`no-user-name ${user.validToken ? '' : 'active'}`}>
                        <Link to="login">Entrar</Link>
                    </div>
                </div>
                <div className='toolbar-buttons'>
                    <button id='btn-admin' className={`material-icons-outlined ${user.isAdministrator ? 'active' : ''}`} onClick={e => showMenuModal(e)}>
                        settings
                    </button>
                    <button id='btn-notification' className="material-icons-outlined">
                        notifications_none
                    </button>
                    <button id='btn-profile' >
                        <Link to="profile" onClick={closeModal}>
                            {profileLoggedUser.id 
                                ? <img className='tumb-profile' src={`${IMAGE_URL_API}/${profileLoggedUser.photo || IMAGE_PROFILE_DEFAULT}`} alt="" />
                                : <span className='tumb-profile material-icons-outlined'> account_circle </span>
                            }
                        </Link>
                    </button>
                </div>
            </div>
        )
    } else {
        return (
            <div className='ToolBar'>
                {toolBarContent}
            </div>
        ) 
    }
    
}

export default ToolBar