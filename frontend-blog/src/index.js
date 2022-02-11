import './index.css'

import ReactDOM from 'react-dom'
import React from 'react'
import App from './App'

import Store from './data/Store'

ReactDOM.render(
    <Store>
        <App/> 
    </Store>,
    document.getElementById('root')
)