import './MyArticles.css'

import React, {useState, useContext, useEffect} from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

import MyArticlesItem from './MyArticlesItem'

import { AppContext } from '../../data/Store'
import { API_URL } from '../../data/Consts'
import Confirmation from '../util/Confirmation'
import HomeArticles from '../home/HomeArticles'

const URL = `${API_URL}/articles`

const MyArticles = props => {
    const [articles, setArticles] = useState([])
    const [status, setStatus] = useState('RASCUNHO')
    const [title, setTitle] = useState('Artigos no Rascunho')
    const [refresh] = useState(props.refresh || true)
    const {setFooterContent, user, profileLoggedUser, showMessage, showModal, closeModal} = useContext(AppContext)
    const navigate = useNavigate()
    
    useEffect( () => {
        const param = window.location.search
        if (param && param.trim() !== '') {
            setStatus(param.replace('?param=', '').trim())
        } 

        getArticles()
        setFooterContentByArticle()
    }, [refresh, status])

    function handleClickArticleItem(articleId) {
        navigate(`/article?param=${articleId}`)
    }

    function getArticles() {
        let endUrl = 'draftArticlesByWriter'
        switch (status) {
            case 'RASCUNHO': 
                endUrl = 'draftArticlesByWriter'
                break
            case 'PUBLICADO': 
                endUrl = 'publishedArticlesByWriter'
                break
            case 'RETIRADO': 
                endUrl = 'unpublisheArticlesByWriter'
                break
            default:
                endUrl = 'draftArticlesByWriter'
                break
        }
        // axios.get(`${URL}/articlesByWriter/${profileLoggedUser.id}`, { headers: {"Authorization": user.token} } )
        axios.get(`${URL}/${endUrl}/${profileLoggedUser.id}`, { headers: {"Authorization": user.token} } )
        .then(resp => {
            if (resp.status === 200) {
                setArticles(resp.data)
            } else {
                setArticles([])
            }
        })
        .catch(error => {  
            console.log('Erro ao selecionar articles => ', error)        
        })
    }

    function handleClickDeleteArticle(article) {
        if (article.status === 'PUBLICADO') {
            const msg = 'Tem certeza que deseja retirar do ar o artigo "' + article.title + '"? '
            showModal(<Confirmation message={msg} confirm={() => unpublishArticle(article)} 
            close={() => closeModal()} cancel={() => closeModal()}/>, 'center')
        } else {
            const msg = 'Tem certeza que deseja excluir o artigo "' + article.title + '"? '
            showModal(<Confirmation message={msg} confirm={() => deleteArticle(article.id)} 
                close={() => closeModal()} cancel={() => closeModal()}/>, 'center')
        }
    }

    function unpublishArticle(article) {
        let articleToUnpublish = article
        article.status = 'RETIRADO'
        axios.put(URL, articleToUnpublish, { headers: {"Authorization": user.token} } )
            .then(resp => {
                showMessage('info', 'O Artigo foi retirado do ar com sucesso!')
            })
            .catch(error => {
                showMessage('error', 'Erro retirar o artigo do ar: Contate administrador!')
                console.log('Erro: ', error.response.data.message)
            })
        closeModal()
    }

    function deleteArticle(articleId) {
        axios.delete(`${URL}/${articleId}`, { headers: {"Authorization": user.token} } )
        .then(resp => {
            console.log('Depois de deletar o artigo: ', resp)
            getArticles()
        })
        .catch(error => {  
            console.log('Erro ao selecionar articles => ', error)        
        })
        closeModal()
    }

    function setStatusAndTitle(status, title, activeDivId) {
        setStatus(status)
        setTitle(title)
        if (activeDivId) {
            const divs = document.getElementsByClassName('button-link')
            for (let i = 0; i < divs.length; i++) {
                divs[i].classList.remove('active')
            }
            const divToActivate = document.getElementById(activeDivId)
            divToActivate.classList.add('active')
        }
    } 

    function setFooterContentByArticle() {
        setFooterContent(
            <div className='profile_footer'>
                <div id='btn-list-draft' className='button-link active'>
                    <button className="button_icon material-icons-outlined" onClick={e => setStatusAndTitle('RASCUNHO', 'Artigos no Rascunho', 'btn-list-draft')}>
                        receipt
                    </button>
                    <span>Rascunhos</span>
                </div>
                <div id='btn-list-published' className='button-link'>
                    <button className="button_icon material-icons-outlined" onClick={e => setStatusAndTitle('PUBLICADO', 'Artigos Publicados', 'btn-list-published')}>
                        task
                    </button>
                    <span>Publicados</span>
                </div>
                <div id='btn-list-unpublished' className='button-link'>
                    <button className="button_icon material-icons-outlined" onClick={e => setStatusAndTitle('RETIRADO', 'Artigos Retirados do Ar', 'btn-list-unpublished')}>
                        unpublished
                    </button>
                    <span>Retirados</span>
                </div>
            </div>
        )
    }

    return (
        <div className='MyArticles'>
            <div className='tab-title'>
                {title}
            </div>
            {(status === 'PUBLICADO')
              ? <HomeArticles writerIdOnly={profileLoggedUser.id}/>
              :  <div>
                    <div className='list-articles'>
                        {articles.map((article, position) => 
                            <MyArticlesItem key={`item_${position}`} article={article} 
                            handleClickArticleItem={handleClickArticleItem}
                            deleteArticle={handleClickDeleteArticle}/>
                            )}
                    </div>
                    <button id='button-add-article' className="btn-add-item material-icons-outlined" onClick={() => navigate('/article')}>
                        add_circle_outline
                    </button>
                </div>
            }
        </div>
    )
}

export default MyArticles