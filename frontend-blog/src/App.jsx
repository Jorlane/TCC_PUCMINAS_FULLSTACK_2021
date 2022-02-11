import './App.css'
import {OPEN_API_URL} from './data/Consts.js'
import React, { useContext, useEffect, useState } from 'react'
import axios  from "axios"

import Footer from './layout/Footer'
import { BrowserRouter } from 'react-router-dom'
import Modal from './components/util/Modal'
import { AppContext }  from './data/Store'
import Content from './layout/Content'
import Message from './components/util/Message'

const URL = `${OPEN_API_URL}/users/validate`
const storageKey = 'blog_token_key'

const App = () => {
    const [firstAccess] = useState(true)

    const {updateLoggedUser} = useContext(AppContext)

    useEffect(() => {
        recoverToken()
        async function recoverToken() {
            const token = localStorage.getItem(storageKey)
            if (token) {
                axios.post(URL, {token})
                .then(resp =>  {
                    const payload = {
                        userProfile: resp.data.userProfile, 
                        token: token, 
                        validToken: resp.data.valid 
                    }
                    updateLoggedUser(payload)
                })
                .catch(function (error) {
                    console.log('error', error.message)
                }); 
            }
        }
        
        

    }, [firstAccess])

    return (
        <div className='App' id='app' >
            <BrowserRouter>
                <Content />
                <Footer />
                <Modal />
                <Message />
            </BrowserRouter>
        </div>
    )
}

export default App