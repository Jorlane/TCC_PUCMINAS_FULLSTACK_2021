import './Paragraph.css'

import React, { useState } from 'react'

const Paragraph = props => {

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
        resizeTextArea()
        setText(e.target.value)
    }

    function handleKeyPress(e) {
        if (e.key && e.key.toUpperCase() === 'ENTER') {
            e.preventDefault()
        }
    }

    function handleFocusOnParagraph(e) {
        const menus = document.getElementsByClassName('item-toolbar')
        for (let i = 0; i < menus.length; i++) {
            menus[i].classList.remove('active')
        }
        
        const menu = document.getElementById(`item-toolbar-${props.paragraph_id}`)
        menu.classList.add('active')

        resizeTextArea()
    }

    return (
        <div className='Article-Section' sectiontype='Paragraph' value={text} id={`div_${props.itemId}`}>
            <textarea  className='input-paragraph' id={props.itemId} type='text' 
                    placeholder='parágrafo...'
                    multiple={true}
                    onKeyUp={e => props.onKeyUp(e, props.divParent)}
                    onKeyPress={handleKeyPress}
                    onChange={handleTextChange}
                    onFocus={handleFocusOnParagraph}
                    value={text}
            />
            
            <div className='item-toolbar' id={`item-toolbar-${props.paragraph_id}`}>
                {props.menu}
            </div>
        </div>
    )
}

export default Paragraph