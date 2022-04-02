import './Logo.css'

import React from  'react'
import {version} from '../../package.json'

const Logo = props => {
    return (
        <div className='Logo'>
            <span id='imageLogo' className="material-icons-outlined">newspaper</span>
            Meu Blog {version}
        </div>
    )
}

export default Logo