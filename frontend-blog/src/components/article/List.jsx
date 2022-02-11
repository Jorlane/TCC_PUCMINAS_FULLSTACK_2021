import './List.css'

import React, { useEffect, useState } from 'react'

let countLi = 1

const List = props => {

    const [list] = useState(props.initList || [])
    const [init] = useState(true)

    useEffect(() => {
        if (props.initList) {
            for (let i = 0; i < props.initList.length; i++) {
                addNewListItem(props.initList[i])
            }
        } else {
            addNewListItem()
        }
        if (props.setCallbackGetList) {
            props.setCallbackGetList(props.itemId, callbackGetList)
        }
    }, [init])

    function autoResize (e) {
        if ((e.target.scrollHeight) > e.target.offsetHeight){
            console.log('e.target.scrollHeight => ', e.target.scrollHeight)
            console.log('e.target.offsetHeight => ', e.target.offsetHeight)
            e.target.rows++;
        }
    }

    function addNewListItem(initTextItem) {
        countLi++
        const newLI = document.createElement('li')
        const itemId = `section_${props.itemId}_li_${countLi}`
        newLI.id = itemId
        const divParent = document.getElementById(props.itemId)
        divParent.appendChild(newLI)
    
        const newInput = document.createElement('input')
        newInput.type = 'text'
        newInput.placeholder = 'Novo item...'
        if (initTextItem && initTextItem !== '') {
            newInput.value = initTextItem
        } else {
            newInput.value = ''
        }
        newInput.classList.add('input-list-item')
        newInput.classList.add(`input-list-item-${props.itemId}`)
        newInput.addEventListener('keypress', handleKeyPress, false)
        const li = document.getElementById(`section_${props.itemId}_li_${countLi}`)
        li.appendChild(newInput)
        newInput.focus()
    }

    function handleKeyDown(e) {
        autoResize(e)
    }

    function handleTextChange(e) {
    }

    function callbackGetList() {
        const items = document.getElementsByClassName(`input-list-item-${props.itemId}`)
        const result = []
        for (let i = 0; i < items.length; i++) {
            result.push(items[i].value)
        }
        return result
    }

    function handleFocusOnList(e) {
        const menus = document.getElementsByClassName('item-toolbar')
        for (let i = 0; i < menus.length; i++) {
            menus[i].classList.remove('active')
        }
        
        const menu = document.getElementById(`item-toolbar-${props.list_id}`)
        menu.classList.add('active')
    }

    function handleKeyPress(e) {
        if (e.key && e.key.toUpperCase() === 'ENTER') {
            if (e.target.value === '') {
                e.preventDefault()
                props.onKeyUp(e, props.divParent)
            } else {
                addNewListItem()
            }
        }
    }

    return (
        <div className='Article-Section' itemid={props.itemId} sectiontype='List' value={list} id={`div_${props.itemId}`}>
            <ul className='input-list' id={props.itemId} type='text' 
                // onKeyUp={e => props.onKeyUp(e, props.divParent)}
                onKeyDown={handleKeyDown}
                onChange={handleTextChange}
                onClick={handleFocusOnList} >
                {/* <li><input className={`input-list-item input-list-item-${props.itemId}`} id={`section_${props.itemId}_li_${countLi}`} type="text" 
                    placeholder='novo item...' 
                    onKeyPress={e => handleKeyPress(e)}/>
                </li> */}
            </ul>
            
            <div className='item-toolbar' id={`item-toolbar-${props.list_id}`}>
                {props.menu}
            </div>
        </div>
    )
}

export default List

