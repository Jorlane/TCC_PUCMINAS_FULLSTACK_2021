import './MyArticlesItem.css'

import React, { useState } from 'react'
import { formatDateFromDateTime } from '../../utils/utils'

const MyArticlesItem = props => {
    const [statusText, setStatusText] = useState(getTextToStatus())
    
    function getTextToStatus() {
        let text = ''
        if (props.article.status.toUpperCase() === 'PUBLICADO') {
            text = 'Publicado em ' + formatDateFromDateTime(props.article.statusDate)
        } else if (props.article.status.toUpperCase() === 'RETIRADO') {
            text = 'Retirado do ar em ' + formatDateFromDateTime(props.article.statusDate)
        } else {
            text = 'Criado em ' + formatDateFromDateTime(props.article.statusDate)
        }
        return text
    }

    return (
        <div className=''>
            <div key={`key_${props.article.id}`} className='MyArticlesItem' >
                <div className='div-content-article' onClick={() => props.handleClickArticleItem(props.article.id)}>
                    <div className='title' >{props.article.title}</div>
                    <div className='div-details'>
                        <div className='status'>{statusText}</div>
                        <div className='comments' >Sem comentários</div>
                        <div className='likes' >Sem curtidas</div>
                    </div>
                </div>
                <div className='div-buttons'>
                    <div className='button-delete-article material-icons-outlined' onClick={() => props.deleteArticle(props.article)}>delete</div>
                </div>
            </div>
        </div>
    )
}   

export default MyArticlesItem