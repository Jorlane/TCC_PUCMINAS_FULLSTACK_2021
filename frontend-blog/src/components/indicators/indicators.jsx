import './indicators.css'

import React, {useEffect, useContext} from 'react'

import { AppContext } from '../../data/Store'

const Indicators = props => {
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
        <div className='Indicators'>
            <h2>Indicadores</h2>
            <h3>(Em desenvolvimento)</h3>
        </div>
    )
}

export default Indicators