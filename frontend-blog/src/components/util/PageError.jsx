import './PageError.css'

import React from 'react'

const PageError = props => {
    return (
        <div className='PageError'>
            <p>{props.message}</p>
        </div>
    )
}

export default PageError