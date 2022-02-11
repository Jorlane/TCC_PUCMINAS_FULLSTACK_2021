import './Body.css'

import React from 'react'

import Header from './Header'
import Content from './Content'

const Body = props => {
    return (
        <div className='Body'>
            <Header />
            <Content />
        </div>
    )
}

export default Body