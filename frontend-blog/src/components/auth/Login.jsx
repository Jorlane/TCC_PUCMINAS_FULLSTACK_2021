import './Login.css'
import { OPEN_API_URL } from '../../data/Consts'

import React, { useState, useContext } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

import GoogleLogin from 'react-google-login'

import { AppContext } from '../../data/Store'

const initialState = {
    email: '', 
    password: '' 
}

const URL = `${OPEN_API_URL}/users/login`
const URLLoginGoogle = `${OPEN_API_URL}/users/loginWithGoogle`

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

    function loginWithGoogleSuccessfully(response) {
        console.log('Dentro de loginWithGoogleSuccessfully')
        console.log(response)
        const {email, name, imageUrl} = response.profileObj
        const tokenGoogle = response.accessToken
        console.log(email, name, imageUrl, tokenGoogle)
        axios.post(URLLoginGoogle, {email, name, imageUrl, tokenGoogle})
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
    }

    function loginWithGoogleFailed(response) {
        console.log('Dentro de loginWithGoogleFailed')
        console.log(response)
    }

    return (
        <div className='Login'>
            <GoogleLogin className='google-login'
                clientId='858076946609-f75tmm9sabls2466eftkrv48podsqqni.apps.googleusercontent.com'
                buttonText='Continuar com o Google'
                onSuccess={loginWithGoogleSuccessfully}
                onFailure={loginWithGoogleFailed}/>
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