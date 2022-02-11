import './ArticleView.css'

import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'

import { AppContext } from '../../data/Store'
import { API_URL, IMAGE_URL_API, OPEN_API_URL, IMAGE_PROFILE_DEFAULT  } from '../../data/Consts'
import { formatDateFromDateTime } from '../../utils/utils'
import Confirmation from '../util/Confirmation'

const initialArticle = {
    id: null,
    writerId: null,
    title: 'teste de titulo',
    categoryId: 1,
    htmlFilePath: "sem html",
    route: "sem rota", 
    writer: {
        id: '', 
        name: '', 
        bioDescription: '', 
        photo: ''
    }, 
    sectionsinarticles: []
}

const URL = `${OPEN_API_URL}/articles`

const ArticleView = props => {
    const {setFooterContent, profileLoggedUser, showModal, closeModal, user, showMessage} = useContext(AppContext)
    const [article, setArticle] = useState(initialArticle)
    const [authorAndDate, setAuthorAndDate] = useState('')
    const [bioDescription, setBioDescription] = useState('')
    const [init] = useState(true)
    const [writerId, setWriterId] = useState(null)

    useEffect(() => {
        
        const param = window.location.search
        if (param && param.trim() !== '') {
            console.log('window.location => ', window.location)
            const articleId = param.replace('?param=', '').trim()
            console.log('***** artigo para editar ===> ', articleId)
            if (articleId !== null && articleId !== '') {
                getArticleToView(articleId)
            }
        } 
        
    }, [init])

    useEffect(() => {
        console.log('Dentro de UseEffect writerId ==> ', writerId)
        setFooterContent(null)
        const buttonRemove = document.getElementById('button-unpublish-article')
        buttonRemove.classList.remove('active')
        if (writerId && profileLoggedUser && writerId === profileLoggedUser.id) {
            buttonRemove.classList.add('active')
        }
    }, [writerId])

    async function getArticleToView(articleId) {
        await axios.get(`${URL}/${articleId}`)
            .then(async resp => {
                if (resp.status === 200) {
                    let articleResult = resp.data
                    await axios.get(`${OPEN_API_URL}/users/${articleResult.writerId}`)
                    .then(respUser => {
                        const writer = respUser.data
                        articleResult.writer = writer
                        setWriterId(writer.id)
                    })
                    
                    setArticle(articleResult)
                    if (articleResult.writer) {
                        setAuthorAndDate(`${articleResult.writer.name} em ${formatDateFromDateTime(articleResult.statusDate)}`)
                        setBioDescription(articleResult.writer.bioDescription || '')
                    }
                }
            })
            .catch(error => {
                console.log('error ====> ', error)
            })
    }

    function handleClickUnpublish() {
        if (article && profileLoggedUser && article.writerId === profileLoggedUser.id) {
            const msg = 'Tem certeza que deseja retirar do ar o artigo "' + article.title + '"? '
            showModal(<Confirmation message={msg} confirm={() => unpublishArticle(article)} 
            close={() => closeModal()} cancel={() => closeModal()}/>, 'center')
        }
    }

    function unpublishArticle(articleParam) {
        let articleToUnpublish = articleParam
        articleParam.status = 'RETIRADO'
        axios.put(`${API_URL}/articles`, articleToUnpublish, { headers: {"Authorization": user.token} } )
            .then(resp => {
                showMessage('info', 'O Artigo foi retirado do ar com sucesso!')
            })
            .catch(error => {
                showMessage('error', 'Erro retirar o artigo do ar: Contate administrador!')
                console.log('Erro: ', error.response.data.message)
            })
        closeModal()
    }

    function setFooterContentByArticle() {
        setFooterContent(
            <div className='article_view_footer'>
                <div id='btn-search' className='button-link'>
                    <button className="button_icon material-icons-outlined">
                        search
                    </button>
                    <span>Pesquisar</span>
                </div>
                <div id='btn-unpublish' className='button-link' onClick={() => handleClickUnpublish(article)}>
                    <button className="button_icon material-icons-outlined">
                        unpublished
                    </button>
                    <span>Retirar artigo do ar</span>
                </div>
                <div id='btn-unpublish' className='button-link'>
                    <button className="button_icon material-icons-outlined" >
                        post_add
                    </button>
                    <span>Escrever</span>
                </div>
            </div>
        )
    }
    
    function getList(text, position) {
        const list = text.split('#!#')
        
        return <ul key={`{ul_${position}}`}>
                {list.map((item, indexItem) => 
                    <li key={`list_${position}_item_${indexItem}`}>{item}</li>
                )}
              </ul>
    }

    return (
        <div className='ArticleView'>
            <div className='div-writer-article-view'>
                <div className='div-profile-img-article-view'>
                    <img  className='image-profile-article-view' src={`${IMAGE_URL_API}/${article.writer.photo || IMAGE_PROFILE_DEFAULT}`} alt="" />
                </div>
                <div className='div-details-article-view'>
                    <div className='author-article-view'>{authorAndDate}</div>
                    <p className='bio-writer-article-view'>{bioDescription}</p>
                    <a href='#' className='link-follow'>(Seguir +)</a>
                </div>
            </div>
            <div className='ArticleViewBody'>
                <h1>{article.title}</h1>
                {article.sectionsinarticles.map((section, position) => {
                    switch (section.sectionId) {
                        case 'CAPTION':
                            return <h2 key={`{h2_${position}}`}>{section.text}</h2>
                        case 'PARAGRAPH':
                            return <p key={`{p_${position}}`}>{section.text}</p>
                        case 'IMAGE':
                            return  <div key={`{div_${position}}`} className='div-img-view'>
                                        <img className='img-view' src={`${IMAGE_URL_API}/article/${section.imagePath}`} alt="" />
                                        <p>{section.text}</p>
                                    </div>
                        case 'CODE':
                            return <pre key={`{pre_${position}}`}>{section.text}</pre>
                        case 'QUOTE':
                            return  <div key={`{div_${position}}`} className='div-quote-view'>
                                        <p className='text-quote-view'><span>"</span>{section.text}<span>"</span></p>
                                        <p className='author-quote-view'>--{section.complement}</p>
                                    </div>
                        case 'LIST':
                            return getList(section.text, position)
                        default:
                            return <p>{section.sectionId}</p>
                    }
                })}
                <div className="ArticleViewFooter">
                    <div className='div-button-like'>
                        <button>
                            <span className="material-icons-outlined">thumb_up</span>
                        </button>
                        <span>Gostei</span>
                    </div>
                    <div className='div-icon-comment'>
                        <span className="material-icons-outlined">campaign</span>
                        <span>Comentários:</span>
                    </div>
                    <div className='div-form-comments'>
                        <p>Seja o primeiro a comentar...</p>
                    </div>
                </div>
            </div>
            <button id='button-unpublish-article' className="btn-unpublish-article material-icons-outlined" 
                onClick={handleClickUnpublish} >
                highlight_off
            </button>
        </div>
    )
}

export default ArticleView