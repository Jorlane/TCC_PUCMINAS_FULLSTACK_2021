import './BlockedUsers.css'

import React, {useEffect, useContext} from 'react'

import { AppContext } from '../../data/Store'

const BlockedUsers = props => {
    const {setFooterContent} = useContext(AppContext)

    useEffect(() => {
        setFooterContentByIndicators()
    })

    function setFooterContentByIndicators() {
        setFooterContent(
            null
        )
    }

    return (
        <div className='BlockedUsers'>
            <h2>Usuários Bloqueados</h2>
            <h3>(Em desenvolvimento)</h3>
        </div>
    )
}

export default BlockedUsers