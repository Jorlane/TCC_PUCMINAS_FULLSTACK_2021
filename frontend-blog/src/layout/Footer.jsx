import './Footer.css'

import React, { useContext } from 'react'
import {Link} from 'react-router-dom'

import { AppContext } from '../data/Store'
import Home from '../components/Home'

const Footer = props => {
    const {footerContent} = useContext(AppContext)
    if (!footerContent) {
        return (
            <footer className='Footer'>
                <button className='button-link' id='btn-write-article'>
                    <span className="material-icons-outlined">search</span>
                    <label>Pesquisar</label>
                </button>
                <Link className='button-link' id='btn-write-article' to='/article'>
                    <span className="material-icons-outlined">post_add</span>
                    <label>Escrever Artigo</label>
                </Link>
                <Link className='button-link' id='btn-home' to='/' element={<Home/>}>
                    <span className="material-icons-outlined">home</span>
                    <label>Home</label>
                </Link>
            </footer>
        )
    } else {
        return (
            <footer className='Footer Customized'>
                {footerContent}
                <Link className='button-link' id='btn-home' to='/' element={<Home/>}>
                    <span className="material-icons-outlined">home</span>
                    <label>Home</label>
                </Link>
            </footer>
        )
    }
}

export default Footer