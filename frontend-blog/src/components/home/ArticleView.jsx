import './ArticleView.css'

import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'

import { AppContext } from '../../data/Store'
import { API_URL, IMAGE_URL_API, OPEN_API_URL, IMAGE_PROFILE_DEFAULT  } from '../../data/Consts'
import { formatDateFromDateTime } from '../../utils/utils'
import Confirmation from '../util/Confirmation'
import ComplaintReason from '../util/ComplaintReason'

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

const initialComments = []

const URL = `${OPEN_API_URL}/articles`

const ArticleView = props => {
    const {setFooterContent, profileLoggedUser, showModal, closeModal, user, showMessage} = useContext(AppContext)
    const [article, setArticle] = useState(initialArticle)
    const [authorAndDate, setAuthorAndDate] = useState('')
    const [bioDescription, setBioDescription] = useState('')
    const [init] = useState(true)
    const [writerId, setWriterId] = useState(null)
    const [like, setLike] = useState(false)
    const [allLikes, setAllLikes] = useState([])
    const [comments, setComments] = useState(initialComments)
    const [descriptionLikes, setDescriptionLikes] = useState('Gostou do artigo?')
    const [youFollowThisWriter, setYouFollowThisWriter] = useState(false)
    const [textInfoFollowers, setTextInfoFollowers] = useState('')
    const [qtdFollowers, setQtdFollowers] = useState(0)

    useEffect(() => {
        const param = window.location.search
        if (param && param.trim() !== '') {
            const articleId = param.replace('?param=', '').trim()
            if (articleId !== null && articleId !== '') {
                getArticleToView(articleId)
            }
        } 

        const divEditComments = document.getElementById('div-edit-comments')
        const divCommentBlocked = document.getElementById('div-comment-blocked')
        if (profileLoggedUser.commentBlocked) {
            divEditComments.classList.add('hidden')
            divCommentBlocked.classList.add('visible')
        } else {
            divEditComments.classList.remove('hidden')
            divCommentBlocked.classList.remove('visible')
        }
        
    }, [init, profileLoggedUser.id])

    useEffect(() => {
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

                    getComments(articleResult.id)
                    getLikes(articleResult.id)
                    if (user && user.validToken) {
                        const data = {
                            userId: profileLoggedUser.id, 
                            articleId: articleResult.id
                        }
                        axios.post(`${API_URL}/interactions/registerReading/`, data, { headers: {"Authorization": user.token} })
                        .then(resp => {
                            console.log('Leitura registrada => ', resp)
                        })
                        .catch(error => {
                            console.log('Erro: ', error.response.data.message)
                        })
                    }
                    getStatusFollow(articleResult.writerId)
                    getFollowers(articleResult.writerId)
                }
            })
            .catch(error => {
                console.log('error ====> ', error)
            })
    }

    function getStatusFollow(writerId) {
        if (user && user.token && user.token != '') {
            axios.get(`${API_URL}/connections/` + writerId, { headers: {"Authorization": user.token} })
            .then(resp => {
                if (resp.status === 200) {
                    setYouFollowThisWriter(true)
                } else {
                    setYouFollowThisWriter(false)
                }
            })
            .catch(err => {
                showMessage('error', 'Erro ao tentar verificar se usuário segue o escritor. Contate o administrador!')
            })
        }
    }
    function getFollowers(writerId) {
        axios.get(`${OPEN_API_URL}/connections/qtdfollowers/` + writerId)
        .then(resp => {
            if (resp.status === 200 && resp.data.count > 0) {
                setQtdFollowers(resp.data.count)
                if (profileLoggedUser.id === writerId) {
                    setTextInfoFollowers('Você tem ' + resp.data.count + ' seguidor(es)!')
                } else {
                    setTextInfoFollowers(resp.data.count + ' seguidor(es)!')
                }
            } else {
                setQtdFollowers(0)
                if (profileLoggedUser.id === writerId) {
                    setTextInfoFollowers('Você')
                } else {
                    setTextInfoFollowers('')
                }
            }
        })
        .catch(err => {
            showMessage('error', 'Erro ao tentar verificar se usuário segue o escritor. Contate o administrador!')
        })
    }

    function getComments(articleId) {
        axios.get(`${OPEN_API_URL}/comments/ ${articleId}`)
            .then(resp => {
                const commentsResult = resp.data
                setComments(commentsResult)
                const elementDivComments = document.getElementById('div-comments')
                elementDivComments.innerHTML = ''
                commentsResult.map((commentItem, index) => {
                    formatCommentItem(commentItem.text, commentItem.user.name, commentItem.date, commentItem.id)
                })
            })
            .catch(err => {
                showMessage('error', 'Erro ao selecionar comentários. Contate o administrador!')
                console.log('Erro ao selecionar comentários. Verifique o log do servidor.')
            })
    }

    function formatTextDescriptionLikes(qtdLikes, indLike) {
        if (qtdLikes > 0) {
            if (indLike) {
                if (qtdLikes > 1) {
                    setDescriptionLikes('Você e mais ' + (qtdLikes - 1) + ' pessoa(s) gostaram deste artigo')
                } else {
                    setDescriptionLikes('Você gostou deste artigo')
                }
            } else {
                if (qtdLikes === 1) {
                    setDescriptionLikes(qtdLikes + ' pessoa gostou deste artigo')
                } else {
                    setDescriptionLikes(qtdLikes + ' pessoas gostaram deste artigo')
                }
            }
        } else {
            setDescriptionLikes('Gostou do artigo?')
        }
    }

    function getLikes(articleId) {
        axios.get(`${OPEN_API_URL}/interactions/${articleId}`)
            .then(resp => {
                let indLike = false
                const likes = resp.data.filter(item => {
                    if (item.like) {

                        if (profileLoggedUser && profileLoggedUser.id === item.userId) {
                            setLike(true)
                            indLike = true
                        }
                        return item
                    }
                })
                setAllLikes(likes)
                setLike(indLike)
                const qtdLikes = likes.length
                formatTextDescriptionLikes(qtdLikes, indLike)
            })
            .catch(err => {
                showMessage('error', 'Erro ao selecionar likes. Contate o administrador!')
                console.log('Erro ao selecionar likes. Verifique o log do servidor.')
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

    function putOrRemoveLike(e) {
        if (!user || !user.validToken) {
            showMessage('info', 'Para curtir o artigo, é necessário efetuar login')
        } else {
            
            //const elementThumbUp = document.getElementById('buttonThumbUp')
            //const elementSuggestLike = document.getElementById('textSuggestLike')
            const data = {
                userId: profileLoggedUser.id, 
                articleId: article.id
            }
            if (!like) {
                axios.post(`${API_URL}/interactions/putLike/`, data, { headers: {"Authorization": user.token} })
                .then(resp => {
                    //elementThumbUp.classList.add('fontcolor-blue')
                    // elementSuggestLike.classList.remove('fontcolor-gray')
                    // elementSuggestLike.classList.add('fontcolor-blue')
                    // elementSuggestLike.innerText = 'Gostei'
                    getLikes(article.id)
                })
                .catch(error => {
                    showMessage('error', 'Erro ao registrar o like.')
                    console.log('Erro: ', error.response.data.message)
                })
            } else {
                axios.post(`${API_URL}/interactions/removeLike/`, data, { headers: {"Authorization": user.token} })
                .then(resp => {
                    //elementThumbUp.classList.remove('fontcolor-blue') 
                    // elementSuggestLike.classList.remove('fontcolor-blue')
                    // elementSuggestLike.classList.add('fontcolor-gray')
                    // elementSuggestLike.innerText = 'Gostou do artigo?'
                    getLikes(article.id)
                })
                .catch(error => {
                    showMessage('error', 'Erro ao remover o like.')
                    console.log('Erro: ', error.response.data.message)
                })
                
            }
        }
    }

    function formatCommentItem(text, userName, date, commentId) {
        const elementDivComments = document.getElementById('div-comments')
        const firstChild = elementDivComments.firstChild
    
        const divGroupComment = document.createElement('div')
        divGroupComment.className = 'div-group-comment'
        const headerComment = document.createElement('div')
        headerComment.className = 'header-comment'
        const commentWriter = document.createElement('div')
        commentWriter.innerText = userName + ' em ' + formatDateFromDateTime(date)
        headerComment.appendChild(commentWriter)
        if (commentId) {
            const buttonOptionComplaint = document.createElement('div')
            buttonOptionComplaint.className = 'button-complaint-article material-icons-outlined'
            buttonOptionComplaint.addEventListener('click', (e => complaint(commentId, text)))
            buttonOptionComplaint.innerText = 'flag_circle'
            headerComment.appendChild(buttonOptionComplaint)
        }

        const textComment = document.createElement('div')
        textComment.className = 'text-comment'
        textComment.innerText = text
        divGroupComment.appendChild(headerComment)
        divGroupComment.appendChild(textComment)
    
        // if (firstChild) {
        //     elementDivComments.insertBefore(divGroupComment, firstChild)
        // } else {
            elementDivComments.appendChild(divGroupComment)
        //}
    }

    function complaint(commentId, commentText) {
        let text = commentText
        if (commentText.length > 100) {
            text = commentText.substring(0, 97) + '...'
        }
        const msg = 'Por favor, informe o motivo para denúncia do comentário "' +  text + '":'
        showModal(<ComplaintReason message={msg} commentId={commentId} confirm={confirmComplaint} 
        close={() => closeModal()} cancel={() => closeModal()}/>, 'center')
    }

    function confirmComplaint(commentId, reasonText) {
        const complaint = {
            commentId: commentId, 
            reason: reasonText
        }
        axios.post(`${OPEN_API_URL}/complaints/`, complaint)
        .then(resp => {
            closeModal()
            showMessage('info', 'Denúncia registrada. Será verificada pela nossa equipe.')
        })
        .catch(error => {
            console.log('Erro ao registrar a denúncia. Contate o Administrador.')
        })
    }

    function comment() {
        
        if (profileLoggedUser && profileLoggedUser.name) {
            if (profileLoggedUser.commentBlocked) {
                showMessage('error', 'Desculpe, mas você está proibido de fazer comentários nos artigos.')
                return
            }
            const inputComment = document.getElementById('commentToInput')
            const commentToAdd = inputComment.value

            if (commentToAdd.trim() != '') {
                const data = {
                    text: commentToAdd, 
                    articleId: article.id,
                    userId: profileLoggedUser.id
                }
                axios.post(`${API_URL}/comments/`, data, { headers: {"Authorization": user.token} })
                .then(resp => {
                    formatCommentItem(commentToAdd, profileLoggedUser.name, Date.now(), null)
                    inputComment.value = ''
                    inputComment.focus()
                })
                .catch(err => {
                    showMessage('error', 'Erro ao tentar incluir comentário. Contate o administrador!')
                    console.log('Erro => ', err)
                })
            }
        } else {
            showMessage('info', 'Para comentar, é necessário fazer o login.')
        }
    }

    function followOrUnfollow(e) {
        if (user && user.token && profileLoggedUser.id && profileLoggedUser.id != article.writerId) {
            const bodyParam = {
                userId: profileLoggedUser.id,
                writerId: article.writerId
            }
            
            if (youFollowThisWriter) {
                axios.delete(`${API_URL}/connections/` + article.writerId, { headers: {"Authorization": user.token} })
                .then(resp => {
                    showMessage('info', 'Agora você não está mais seguindo esse escritor.')
                })
                .catch(err => {
                    showMessage('error', 'Erro ao tentar deixar de seguir escritor. Contate o administrador!')
                })
            } else {
                axios.post(`${API_URL}/connections/`, bodyParam, { headers: {"Authorization": user.token} })
                .then(resp => {
                    showMessage('info', 'Agora você está seguindo esse escritor')
                })
                .catch(err => {
                    showMessage('error', 'Erro ao tentar seguir escritor. Contate o administrador!')
                })
            }
            setYouFollowThisWriter(!youFollowThisWriter)
        } else {
            showMessage('info', 'Para seguir um escritor, é necessário efetuar o login.')
        }
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
                    <p className='info-followers'>
                        {textInfoFollowers}
                    </p>
                    {(profileLoggedUser.id != article.writerId) && (
                        <a href='#' className='link-follow' onClick={followOrUnfollow}>
                            { youFollowThisWriter ? 'Seguindo (Deixar de seguir)' : '(Seguir +)'}
                        </a>
                    )}
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
                        <button onClick={putOrRemoveLike}>
                            <span id='buttonThumbUp' className={like ? 'material-icons-outlined thumb-up fontcolor-blue' : 'material-icons-outlined thumb-up fontcolor-darkgray'}>thumb_up</span>
                        </button>
                        <span id='textSuggestLike' className='fontcolor-gray'>{descriptionLikes}</span>
                    </div>
                    <div className='div-icon-comment'>
                        <span className="material-icons-outlined">campaign</span>
                        <span>Comentários:</span>
                    </div>
                    <div className='div-form-comments'>
                        <div id='div-comments'>
                        </div>
                        <div id='div-edit-comments'>
                            <textarea id='commentToInput' className='inputComment' type="text" rows="3" placeholder='Digite aqui seu comentário...'/>
                            <button id='buttonSendComment' className='material-icons-outlined' onClick={comment}>
                                send
                            </button>
                        </div>
                        <div id='div-comment-blocked'>
                            Observação: No momento, você está proibido de comentar nos artigos. Contate o administrador!
                        </div>
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


