import './ComplaintList.css'

import React, {useEffect, useContext, useState} from 'react'

import { AppContext } from '../../data/Store'
import { API_URL, IMAGE_URL_API, OPEN_API_URL, IMAGE_PROFILE_DEFAULT  } from '../../data/Consts'
import axios from 'axios'
import ComplaintItem from './ComplaintItem'

const ComplaintList = props => {
    const {setFooterContent, showMessage, user} = useContext(AppContext)
    const [complaintList, setComplaintList] = useState([])
    const [init] = useState(true)

    useEffect(() => {
        setFooterContentByComplaints()
        axios.get(`${API_URL}/complaints/`, { headers: {"Authorization": user.token} })
        .then(resp => {
            const complaintsResult = resp.data
            setComplaintList(complaintsResult)
        })
        .catch(err => {
            showMessage('error', 'Erro ao selecionar denúncias. Contate o administrador!')
            console.log('Erro ao selecionar denúncias. Verifique o log do servidor.')
        })
    }, [init])

    function setFooterContentByComplaints() {
        setFooterContent(
            null
        )
    }

    function deferComplaint(complaintId) {
        return new Promise((resolve, reject) => {
            const bodyParam = {
                status: 'DEFERIDA'
            }
            axios.put(`${API_URL}/complaints/` + complaintId, bodyParam, { headers: {"Authorization": user.token} })
            .then(resp => {
                resolve({status: resp.status, data: resp.data})
            })
            .catch(err => {
                reject(err)
            })
        })
    }

    function deleteComment(complaintId, commentId, callbackUpdateStatus) {
        deferComplaint(complaintId)
        .then(resp => {
            const bodyParam = {
                status: 'EXCLUIDO-ADMIN'
            }
            axios.put(`${API_URL}/comments/` + commentId, bodyParam, { headers: {"Authorization": user.token} })
            .then(resp => {
                showMessage('info', 'A denúncia foi aceita e o comentário excluído.')
                if (callbackUpdateStatus) {
                    callbackUpdateStatus('DEFERIDA')
                }
            })
            .catch(err => {
                showMessage('error', 'Erro ao tentar excluir o comentário. Contate o administrador!')
            })
        }).catch(err => {
            showMessage('error', 'Erro ao tentar deferir a denúncia. Contate o administrador!')
        })
    }

    function blockUser(complaintId, commentId, userId, callbackUpdateStatus) {
        deferComplaint(complaintId)
        .then(resp => {
            const bodyParam = {
                status: 'EXCLUIDO-ADMIN'
            }
            axios.put(`${API_URL}/comments/` + commentId , bodyParam, { headers: {"Authorization": user.token} })
            .then(resp => {
                axios.put(`${API_URL}/users/blockComments/`, {userId: userId}, { headers: {"Authorization": user.token} })
                .then(resp => {
                    showMessage('info', 'Denúncia aceita, comentário excluído e usuário bloqueado de comentar.')
                    if (callbackUpdateStatus) {
                        callbackUpdateStatus('DEFERIDA')
                    }
                })
            })
            .catch(err => {
                showMessage('error', 'Erro ao tentar excluir o comentário. Contate o administrador!')
            })
        }).catch(err => {
            showMessage('error', 'Erro ao tentar deferir a denúncia. Contate o administrador!')
        })
    }

    function ignoreComplaint(complaintId, callbackUpdateStatus) {
        const bodyParam = {
            status: 'INDEFERIDA'
        }
        axios.put(`${API_URL}/complaints/` + complaintId, bodyParam, { headers: {"Authorization": user.token} })
        .then(resp => {
            showMessage('info', 'A denúncia foi rejeitada com sucesso.')
            if (callbackUpdateStatus) {
                callbackUpdateStatus('INDEFERIDA')
            }
        })
        .catch(err => {
            showMessage('error', 'Erro ao tentar deferir a denúncia. Contate o administrador!')
        })
    }

    return (
        <div className='ComplaintList'>
            <div className='ComplaintTitle'>
                Gerenciar Denúncias
            </div>
            <div className='ComplaintListItens'>
                {complaintList.map(complaintItem => {
                    return <ComplaintItem key={`complaint_${complaintItem.id}`} complaint={complaintItem}
                            deleteComment={deleteComment}
                            blockUser={blockUser}
                            ignoreComplaint={ignoreComplaint}/>
                })}
            </div>
        </div>
    )
}

export default ComplaintList