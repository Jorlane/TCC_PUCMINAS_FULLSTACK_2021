import './Title.css'

import React, { useEffect, useState } from 'react'

const Title = props => {
    const [text, setText] = useState(props.initTitle)

    function resizeTextArea() {
        const e = document.getElementById(props.itemId)
        if (e) {
            while ((e.scrollHeight) > e.offsetHeight) {
                console.log('e.target.scrollHeight => ', e.scrollHeight)
                console.log('e.target.offsetHeight => ', e.offsetHeight)
                e.rows++;
            }
        }
    }

    function handleTextChange(e) {
        setText(e.target.value)
        resizeTextArea()
    }

    function handleFocus(e) {
        const menus = document.getElementsByClassName('item-toolbar')
        for (let i = 0; i < menus.length; i++) {
            menus[i].classList.remove('active')
        }
        
        const menu = document.getElementById(`item-toolbar-${props.itemId}`)
        menu.classList.add('active')
    }

    return (
        <div className='Title'>
             <input className='input-title' id={props.itemId} type="text" placeholder='Título...'
                value={text} 
                maxLength='80' autoComplete='off' rows='2'
                onKeyUp={e => props.handleKeyUp(e, props.divParent)}
                onKeyDown={props.handleKeyDown}
                onKeyPress={props.handleKeyPress}
                onFocus={e => handleFocus(e)}
                onChange={e => handleTextChange(e)}
                    />
            
            <div className='item-toolbar' id={`item-toolbar-${props.itemId}`}>
                {props.menu}
            </div>
        </div>
    )
}

export default Title