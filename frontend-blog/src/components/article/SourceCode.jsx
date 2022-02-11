import './SourceCode.css'

import React, { useState } from 'react'

const SourceCode = props => {

    const [text, setText] = useState(props.initText || '')

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

    function handleKeyPress(e) {
        // if (e.key && e.key.toUpperCase() === 'ENTER') {
        //     e.preventDefault()
        // }
    }

    function handleFocusOnSourceCode(e) {
        const menus = document.getElementsByClassName('item-toolbar')
        for (let i = 0; i < menus.length; i++) {
            menus[i].classList.remove('active')
        }
        
        const menu = document.getElementById(`item-toolbar-${props.sourcecode_id}`)
        menu.classList.add('active')
        resizeTextArea()
    }

    return (
        <div className='Article-Section' sectiontype='CODE' value={text} id={`div_${props.itemId}`}>
            <div className='div-source-area'>
                <textarea  className='input-sourcecode' id={props.itemId} type='text' 
                    placeholder='Código fonte...'
                    multiple={true}
                    //onKeyUp={e => props.onKeyUp(e, props.divParent)}
                    onKeyPress={handleKeyPress}
                    onChange={handleTextChange}
                    onFocus={handleFocusOnSourceCode}
                    value={text}
                    />
            </div>
            
            <div className='item-toolbar' id={`item-toolbar-${props.sourcecode_id}`}>
                {props.menu}
            </div>
        </div>
    )
}

export default SourceCode