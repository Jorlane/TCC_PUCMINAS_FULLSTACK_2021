import './Caption.css'

import React, { useState } from 'react'

const Caption = props => {
    const [text, setText] = useState(props.initText || '')

    function handleTextChange(e) {
        setText(e.target.value)
    }

    function handleKeyPress(e) {
        if (e.key && e.key.toUpperCase() === 'ENTER') {
            e.preventDefault()
        }
    }

    function handleFocusOnCaption(e) {
        const menus = document.getElementsByClassName('item-toolbar')
        for (let i = 0; i < menus.length; i++) {
            menus[i].classList.remove('active')
        }
        
        const menu = document.getElementById(`item-toolbar-${props.caption_id}`)
        menu.classList.add('active')
    }

    return (
        <div className='Article-Section' sectiontype='Caption' value={text} id={`div_${props.itemId}`}>
            <input className='input-caption' id={props.itemId} type='text' 
                placeholder='Subtítulo...'
                multiple={false}
                onKeyUp={e => props.onKeyUp(e, props.divParent)}
                onKeyPress={handleKeyPress}
                onChange={handleTextChange}
                onFocus={handleFocusOnCaption}
                value={text}
            />
            
            <div className='item-toolbar' id={`item-toolbar-${props.caption_id}`}>
                {props.menu}
            </div>
        </div>
    )
    
}

export default Caption