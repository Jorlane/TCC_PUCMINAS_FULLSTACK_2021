import './Menu.css'

import React, { useContext } from 'react'
import {Link} from 'react-router-dom'

import {AppContext} from '../data/Store'

function toggleMenu() {
    const menuList = document.getElementById('menu-list')
    menuList.classList.toggle('active')
    const iconMenu = document.getElementById('hamburger')
    if (menuList.classList.contains('active')) {
        iconMenu.innerHTML = 'close'
    } else {
        iconMenu.innerHTML = 'menu'
    }
}

function toogleActiveSubmenu(e) {
    const children = e.target.children
    console.log('CHILDREN => ', children)
}

const Menu = props => {
    const {user} = useContext(AppContext)

    return (
        <nav className='Menu'>
            
            <ul id='menu-list'>
                <li className={`menu-item ${user.isAdministrator ? 'active' : ''}`} onClick={e => toogleActiveSubmenu(e)}><span>Administração</span>
                    <ul id='submenu-adm' className='submenu'>
                        <li className='submenu-item'><Link to="categories" >Categorias</Link></li>
                        <li className='submenu-item'><Link to="/">Denúncias</Link></li>
                        <li className='submenu-item'><Link to="/">Usuários Bloqueados</Link></li>
                    </ul>
                </li>
                <li className={`menu-item ${user.validToken ? 'active' : ''}`}>
                    <Link to="profile">Perfil</Link>
                </li>
                <li  className={`menu-item ${user.validToken ? 'active' : ''}`}><span>Blog</span>
                    <ul id='submenu-blog' className='submenu'>
                        <li className='submenu-item'><Link to="blogpreferences">Preferências</Link></li>
                        <li className='submenu-item'><Link to="in">Minhas Conexões</Link></li>
                        <li className='submenu-item'><Link to="/">Meus Indicadores</Link></li>
                        <li className='submenu-item'><Link to='myarticles'>Meus Artigos</Link></li>
                    </ul>
                </li>
                <li className='menu-item active'><Link to="/">Pesquisar</Link></li>
                <li className='menu-item active'><Link to='article'>Escrever</Link></li>
                <li className={`menu-item ${user.validToken ? 'active' : ''}`}><Link to="/">Notificações</Link></li>
                <li className={`menu-item ${user.validToken ? 'active' : ''}`}><Link to="logout">Sair</Link></li>
            </ul>

            <button id='btn-mobile' onClick={() => toggleMenu()}>
                <span id='hamburger' className="material-icons-outlined">menu</span>
            </button>
            {/* <span id='iconCloseMenu' class="material-icons">&#xe5cd;</span> */}
        </nav>
    )
}

export default Menu