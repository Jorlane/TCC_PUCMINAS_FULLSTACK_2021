import './CategoryListItem.css'

import React from 'react'

import { formatDateFromDateTime } from '../../utils/utils'
const CategoryListItem = props => {

    const category = props.item.category
    const children = props.item.children || []

    const initDateFormatted = formatDateFromDateTime(category.initDate)
    
    function handleClickExpandCategory(e) {
        e.target.classList.toggle('column-expand-down')

        const elementChildren = e.target.parentElement.nextSibling
        if (elementChildren) {
            elementChildren.classList.toggle('active')
        }
    }

    function getChildrenKey(item) {
        return 'id_' + item.id  + '_child_of_' + item.categoryParent
    }

    const itemId = 'category_' + category.id
    return (
        <li key={itemId} className='CategoryListItem'>
            <div className={props.position%2===0 ? 'category-list-item-root pair' : 'category-list-item-root odd'}>
                <div className='column-expand' show-icon={children.length > 0 ? 'yes' : 'no'} onClick={(e) => handleClickExpandCategory(e)}></div>
                <div className='column-category' onClick={() => props.handleClickListItem(category)}>{category.name}</div>
                <div className='column-date' onClick={() => props.handleClickListItem(category)}>{initDateFormatted}</div>
                <div className='column-action' id='button-remove' onClick={() => props.handleRemoveListItem(category)} ><span className="material-icons-outlined">delete</span></div>
            </div>
            <div className='category-children'>
                {children.map(child => 
                    <div key={getChildrenKey(child)} className='category-list-item-child-header'>
                        <div className='column-space-child'>_</div>
                        <div className='category-list-item-child'>
                            <div className='column-category-child' onClick={() => props.handleClickListItem(child)}>{child.name}</div>
                            <div className='column-date-child' onClick={() => props.handleClickListItem(child)}>{formatDateFromDateTime(child.initDate)}</div>
                            <div className='column-action' id='button-remove' onClick={() => props.handleRemoveListItem(child)} ><span className="material-icons-outlined">delete</span></div>
                        </div>
                    </div>
                )}
            </div>
        </li>
    )
}

export default CategoryListItem