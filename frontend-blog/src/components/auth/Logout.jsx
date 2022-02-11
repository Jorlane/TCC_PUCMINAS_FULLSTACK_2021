import './Logout.css'

import React, {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

import { AppContext } from '../../data/Store'
import { initialState } from '../../store/Reducer'

const Logout = props => {
    const [user] = useState(initialState)

    const {updateLoggedUser} = useContext(AppContext)

    const navigate = useNavigate()

    useEffect(() => {
        const payload = {
            userProfile: initialState.profileLoggedUser,
            token: '', 
            validToken: false
        }
        updateLoggedUser(payload)
        navigate('/', {replace: true})

    }, [user, navigate, updateLoggedUser])

    return (
        <div className='Logout'>
        </div>
    )
}

export default Logout

