import './Login.css'
import { OPEN_API_URL } from '../../data/Consts'

import React, { useState, useContext } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

import { AppContext } from '../../data/Store'

const initialState = {
    email: '', 
    password: '' 
}

const URL = `${OPEN_API_URL}/users/login`

const Login = props => {
    
    const [userLogin, setUserLogin] = useState(initialState)
    const {updateLoggedUser} = useContext(AppContext)
    const [messageAlert, setMessageAlert] = useState('')

    const navigate = useNavigate()
    
    function handleOnChange(e, key) {
        setUserLogin({
            ...userLogin, 
            [key]: e.target.value
        })
    }

    function alertError(message, targetFocus) {
        setMessageAlert(message)
        const elementToFocus = document.getElementById(targetFocus)
        elementToFocus.focus()
    }
    
    function doLogin(e) {
        axios.post(URL, userLogin)
        .then(resp =>  {
            const payload = {
                userProfile: resp.data.userProfile, 
                token: resp.data.token, 
                validToken: resp.data.valid 
            }
            updateLoggedUser(payload)
            navigate('/blog-jorlane/', {replace: true})
        })
        .catch(error => {
            alertError(error.response.data.message, 'user-email')
        });
        e.preventDefault();
    }

    return (
        <div className='Login'>
            <form className='form-login'>
                <label htmlFor='user-email'>Email:</label>
                <input type="email" id='user-email' name='user-email' value={userLogin.email} onChange={e => handleOnChange(e, 'email')}/>
                <label htmlFor="user-password">Senha:</label>
                <input type="password" id='user-password' name='user-password' value={userLogin.password} onChange={e => handleOnChange(e, 'password')}/>
                <div id='message-alert'>
                    {messageAlert}
                </div>
                <button className='btn-login' onClick={e => doLogin(e)}>Entrar</button>
            </form>
            <div className='link-new-account'>
                <Link to="/blog-jorlane/signup">Clique aqui</Link> para criar uma conta!
            </div>
        </div>
    )
}

export default Login