import './HomeArticlesItem.css'

import React, { useEffect, useState } from 'react'
import { formatDateFromDateTime } from '../../utils/utils'
import { IMAGE_URL_API, IMAGE_PROFILE_DEFAULT} from '../../data/Consts'

const HomeArticlesItem = props => {
    const [authorAndDate] = useState(getAuthorAndDate())
    const [bioDescription] = useState(getBioDescription())
    const [imageFile, setImageFile] = useState('')
    
    useEffect(() => {
        const sections = props.article.sectionsinarticles
        let text = ''
        const textViewElement = document.getElementById(`text-view-${props.article.id}`)
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].sectionId === 'PARAGRAPH') {
                if (text.length < 200) {
                    const limit = 200 - text.length
                    let paragraphToInclude = ''
                    if (sections[i].text.length <= limit) {
                        paragraphToInclude = sections[i].text
                    } else if (sections[i].text.length > limit) {
                        paragraphToInclude = sections[i].text.substring(0, limit) + '...'
                    }
                    text = text + paragraphToInclude
                    const p = document.createElement('p')
                    p.innerText = paragraphToInclude
                    textViewElement.appendChild(p)
                }
            } else if (imageFile === '' && sections[i].sectionId === 'IMAGE') {
                setImageFile(`${IMAGE_URL_API}/article/${sections[i].imagePath}`)
            }
        }
    }, [authorAndDate])

    function getAuthorAndDate() {
        if (props.article.writer) {
            return `${props.article.writer.name} em ${formatDateFromDateTime(props.article.statusDate)}`
        } else {
            return `Em ${formatDateFromDateTime(props.article.statusDate)}`
        }
    }

    function getBioDescription() {
        const bio = props.article.writer.bioDescription || ''
        if (bio.length > 200) {
            return bio.substr(0, 180) + '...'
        } else {
            return bio
        }
    }

    return (
        <div className=''>
            <div key={`key_${props.article.id}`} className='HomeArticlesItem' >
                <div className='div-content-article' onClick={() => props.handleClickArticleItem(props.article)}>
                    <div className='title' >{props.article.title}</div>
                    <div className='div-body-article'>
                        <div className='text-view' id={`text-view-${props.article.id}`}></div>
                        <img className='img-view' src={imageFile} alt="" />
                    </div>
                    <div className='div-article-writer'>
                        <div className='div-img-article-profile'>
                            <img  className='image-article-profile' src={`${IMAGE_URL_API}/${props.article.writer.photo || IMAGE_PROFILE_DEFAULT}`} alt="" />
                        </div>
                        <div className='div-details'>
                            <div className='author-article'>{authorAndDate}</div>
                            <div className='bio-writer-article'>{bioDescription}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}   

export default HomeArticlesItem