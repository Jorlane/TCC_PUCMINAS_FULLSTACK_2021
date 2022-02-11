
import React, { useContext } from 'react'

import Login from './Login'
import {AppContext} from '../../data/Store'

const PrivateRoute = props => {
    const {user} = useContext(AppContext)
    if (user.validToken) {
        return (
            props.element
        )
    } else {
        return (
            <Login />
        )
    }
}
export default PrivateRoute