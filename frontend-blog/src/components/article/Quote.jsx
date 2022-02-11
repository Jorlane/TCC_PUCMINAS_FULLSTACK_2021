import './Quote.css'

import React, { useState } from 'react'

const Quote = props => {

    const [text, setText] = useState(props.initText || '')
    const [author, setAuthor] = useState(props.complement || '')

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

    function handleAuthorChange(e) {
        setAuthor(e.target.value)
    }

    function handleKeyPress(e) {
        if (e.key && e.key.toUpperCase() === 'ENTER') {
            e.preventDefault()
        }
    }

    function handleFocusOnQuote(e) {
        const menus = document.getElementsByClassName('item-toolbar')
        for (let i = 0; i < menus.length; i++) {
            menus[i].classList.remove('active')
        }
        
        const menu = document.getElementById(`item-toolbar-${props.quote_id}`)
        menu.classList.add('active')
        resizeTextArea()
    }

    return (
        <div className='Article-Section' sectiontype='Quote' value={text} author={author} id={`div_${props.itemId}`}>
            <div className='div-quote-area'>
                <div className='group-quote-items'>
                    <span className='quotation-mark'>"</span>
                    <textarea  className='input-quote' id={props.itemId} type='text' 
                            placeholder='Citação...'
                            multiple={true}
                            onKeyUp={e => props.onKeyUp(e, props.divParent)}
                            onKeyPress={handleKeyPress}
                            onChange={handleTextChange}
                            onFocus={handleFocusOnQuote}
                            value={text}
                            />
                    <span className='quotation-mark rigth'>"</span>
                    <input className='quote-author' type="text" placeholder='Autor...' value={author} onChange={handleAuthorChange}/>
                </div>
            </div>
            
            <div className='item-toolbar' id={`item-toolbar-${props.quote_id}`}>
                {props.menu}
            </div>
        </div>
    )
}

export default Quote