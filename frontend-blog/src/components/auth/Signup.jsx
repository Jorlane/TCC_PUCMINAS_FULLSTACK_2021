import './Signup.css'
import { OPEN_API_URL } from '../../data/Consts'

import React, {useState, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

import { AppContext } from '../../data/Store'

const initialState = {
    name: '',
    email: '', 
    password: '', 
    confirmPassword: '',
}

const URL =  `${OPEN_API_URL}/users/signup`

const Signup = props => {
    const [user, setUser] = useState(initialState)
    const {updateLoggedUser} = useContext(AppContext)
    const [messageAlert, setMessageAlert] = useState('')

    const navigate = useNavigate()
    
    function handleOnChange(e, key) {
        setUser({
            ...user, 
            [key]: e.target.value
        })
        if (messageAlert !== '') {
            setMessageAlert('')
        }
    }

    function alertError(message, targetFocus) {
        setMessageAlert(message)
        const elementToFocus = document.getElementById(targetFocus)
        elementToFocus.focus()
    }
    
    function doSignup(e) {
        axios.post(URL, user)
        .then(resp => {
            const payload = {
                userProfile: resp.data.userProfile, 
                token: resp.data.token, 
                validToken: resp.data.valid 
            }
            updateLoggedUser(payload)
            navigate('/', {replace: true})
        })
        .catch(error => {
            let elementoToFocus = 'user-email'
            if (error.response.data.column === 'password') {
                elementoToFocus = 'user-password'
            } else if (error.response.data.column === 'name') {
                elementoToFocus = 'user-name'
            }
            alertError(error.response.data.message, elementoToFocus)
        });
        e.preventDefault();
    }

    return (
        <div className='Signup'>
            <form className='form-signup'>
                <label htmlFor="user-name">Nome:</label>
                <input type="name" id='user-name' name='user-name' value={user.name} onChange={e => handleOnChange(e, 'name')}/>
                <label htmlFor='user-email'>Email:</label>
                <input type="email" id='user-email' name='user-email' value={user.email} onChange={e => handleOnChange(e, 'email')}/>
                <label htmlFor="user-password">Senha:</label>
                <input type="password" id='user-password' name='user-password' value={user.password} onChange={e => handleOnChange(e, 'password')}/>
                <label htmlFor="user-password">Confirmação de senha:</label>
                <input type="password" id='confirm-password' name='confirm-password' value={user.confirmPassword} onChange={e => handleOnChange(e, 'confirmPassword')}/>
                <div id='message-alert'>
                    {messageAlert}
                </div>
                <button className='btn-signup' onClick={e => doSignup(e)}>Registrar</button>
            </form>
        </div>
    )
}

export default Signup