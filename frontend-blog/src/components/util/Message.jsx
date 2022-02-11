import './Message.css'

import React, {useContext} from 'react'

import {AppContext} from '../../data/Store'

const Message = props => {
    const {messageVisible, messageType, messageText} = useContext(AppContext)

    return (
        <div className='Message' visible={messageVisible ? 'visible' : 'hidden'} >
            <div className='message-text' type={messageType}>
                {messageText}
            </div>
        </div>
    )
}

export default Message