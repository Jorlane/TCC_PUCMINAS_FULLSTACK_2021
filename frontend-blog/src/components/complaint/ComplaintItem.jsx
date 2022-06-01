import './ComplaintItem.css'

import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'

import { formatDateFromDateTime } from '../../utils/utils'
import { AppContext } from '../../data/Store'
import { API_URL, IMAGE_URL_API, OPEN_API_URL, IMAGE_PROFILE_DEFAULT  } from '../../data/Consts'

const ComplaintItem = props => {
    const {setFooterContent, showMessage, user} = useContext(AppContext)
    const [commentUserName, setCommentUserName] = useState('nome do usuário')
    const [commentUserImg, setCommentUserImg] = useState('')
    const [commentContent, setCommentContent] = useState('conteúdo do comentário')
    const [commentDate, setCommentDate] = useState('dd/mm/yyyy')
    const [articleTitle, setArticleTitle] = useState('Título do artigo')
    const [status, setStatus] = useState(props.complaint.status)
    const [init] = useState(true)

    useEffect(() => {
        axios.get(`${API_URL}/comments/` + props.complaint.commentId, { headers: {"Authorization": user.token} })
        .then(resp => {
            if (resp.status === 200) {
                setCommentUserName(resp.data.user.name)
                setCommentUserImg(`${IMAGE_URL_API}/${resp.data.user.photo || IMAGE_PROFILE_DEFAULT}`)
                setCommentContent(resp.data.text)
                setCommentDate(formatDateFromDateTime(resp.data.date))
                setArticleTitle(resp.data.article.title)
            }
        })
        .catch(err => {
            showMessage('error', 'Erro ao selecionar denúncias. Contate o administrador!')
            console.log('Erro ao selecionar denúncias. Verifique o log do servidor.')
        })
    }, [init])

    function updateStatus(status) {
        console.log('Atualizando status => ', status)
        setStatus(status)
    }

    return (
        <div className='ComplaintItem'>
            <div className='ComplaintItemMain'>
                <div className='leftColumn'>
                    <div>Comentado por: </div>
                    <img className='img-view-profile-complaint' src={commentUserImg} alt="" />
                    <div className='div-user-comment'>{commentUserName} </div>
                    <div>em:</div>
                    <div>{commentDate}</div>
                </div>
                <div className='rightColumn'>
                    <div className='div-status'>Status da denúncia: <span className={`text-status ${status}`}>{status}</span></div>
                    <div className='div-article'>Artigo: {articleTitle}</div>
                    <div className='div-comment-content'>O comentário: "{commentContent}" </div>
                    <div className='div-complaint-reason'>Motivo da denúncia: "{props.complaint.reason}" </div>
                    <div className='div-complaint-buttons'>
                        <div className='button-complaint' onClick={() => props.deleteComment(props.complaint.id, props.complaint.comment.id, updateStatus)}>
                            <span className='material-icons-outlined'>comments_disabled</span>Excluir Comentário</div>
                        <div className='button-complaint' onClick={() => props.blockUser(props.complaint.id, props.complaint.comment.id, props.complaint.comment.userId, updateStatus)}>
                            <span className='material-icons-outlined'>person_off</span>Bloquear Usuário</div>
                        <div className='button-complaint' onClick={() => props.ignoreComplaint(props.complaint.id, updateStatus)}>
                            <span className='material-icons-outlined'>delete</span>Ignorar Denúncia</div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default ComplaintItem