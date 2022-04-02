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
                        <li className='submenu-item'><Link to="blog-jorlane/categories" >Categorias</Link></li>
                        <li className='submenu-item'><Link to="blog-jorlane/">Denúncias</Link></li>
                        <li className='submenu-item'><Link to="blog-jorlane/">Usuários Bloqueados</Link></li>
                    </ul>
                </li>
                <li className={`menu-item ${user.validToken ? 'active' : ''}`}>
                    <Link to="blog-jorlane/profile">Perfil</Link>
                </li>
                <li  className={`menu-item ${user.validToken ? 'active' : ''}`}><span>Blog</span>
                    <ul id='submenu-blog' className='submenu'>
                        <li className='submenu-item'><Link to="blog-jorlane/blogpreferences">Preferências</Link></li>
                        <li className='submenu-item'><Link to="blog-jorlane/in">Minhas Conexões</Link></li>
                        <li className='submenu-item'><Link to="blog-jorlane//">Meus Indicadores</Link></li>
                        <li className='submenu-item'><Link to='blog-jorlane/myarticles'>Meus Artigos</Link></li>
                    </ul>
                </li>
                <li className='menu-item active'><Link to="blog-jorlane/">Pesquisar</Link></li>
                <li className='menu-item active'><Link to='blog-jorlane/article'>Escrever</Link></li>
                <li className={`menu-item ${user.validToken ? 'active' : ''}`}><Link to="blog-jorlane//">Notificações</Link></li>
                <li className={`menu-item ${user.validToken ? 'active' : ''}`}><Link to="blog-jorlane/logout">Sair</Link></li>
            </ul>

            <button id='btn-mobile' onClick={() => toggleMenu()}>
                <span id='hamburger' className="material-icons-outlined">menu</span>
            </button>
            {/* <span id='iconCloseMenu' class="material-icons">&#xe5cd;</span> */}
        </nav>
    )
}

export default Menu