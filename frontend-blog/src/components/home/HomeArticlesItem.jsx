import './HomeArticlesItem.css'

import React, { useEffect, useState } from 'react'
import { formatDateFromDateTime } from '../../utils/utils'
import { IMAGE_URL_API, IMAGE_PROFILE_DEFAULT} from '../../data/Consts'

const HomeArticlesItem = props => {
    const [authorAndDate] = useState(getAuthorAndDate())
    const [bioDescription] = useState(getBioDescription())
    const [textView, setTextView] = useState('')
    const [imageFile, setImageFile] = useState('')
    
    useEffect(() => {
        const sections = props.article.sectionsinarticles
        let text = ''
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].sectionId === 'PARAGRAPH') {
                if (text === '' && text.length < 580) {
                    text = sections[i].text
                } else if (text.length < 200) {
                    text = text + '/n' + sections[i].text
                }
            } else if (imageFile === '' && sections[i].sectionId === 'IMAGE') {
                setImageFile(`${IMAGE_URL_API}/article/${sections[i].imagePath}`)
                console.log('Setando a imagem ==> ', `${IMAGE_URL_API}/article/${sections[i].imagePath}`)
            }
            if (text.length >= 580) {
                text = text.substring(0, 580) + '...'
            }
        }
        setTextView(text)
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
                        <div className='text-view' >{textView}</div>
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