import React, { useContext } from 'react'

import Login from './Login'
import {AppContext} from '../../data/Store'
import PageError from '../util/PageError'

const AdminRoute = props => {
    const {user} = useContext(AppContext)
    if (user.validToken) {
        if (user.isAdministrator) {
            return (
                props.element
            )
        } else {
            return (
                <PageError message='Acesso não permitido! Por favor, entre em contato com o administrador do sistema!'/>
            )
        }
    } else {
        return (
            <Login />
        )
    }
}

export default AdminRoute