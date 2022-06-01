import './Connections.css'

import React, {useEffect, useContext, useState} from 'react'
import axios from 'axios'

import { AppContext } from '../../data/Store'
import { API_URL, IMAGE_URL_API, OPEN_API_URL, IMAGE_PROFILE_DEFAULT  } from '../../data/Consts'
import ConnectionItem  from './ConnectionItem'
import Confirmation from '../util/Confirmation'

const Connections = props => {

    const {showMessage, user, profileLoggedUser, showModal, closeModal} = useContext(AppContext)
    const [init, setInit] = useState(0)
    const [followers, setFollowers] = useState([])
    const [followings, setFollowings] = useState([])

    useEffect(() => {
        getFollowers()
        getFollowings()
        
    }, [init, profileLoggedUser.id])

    function getFollowers() {
        const userId = profileLoggedUser.id
        axios.get(`${API_URL}/connections/followers/` + userId, { headers: {"Authorization": user.token} })
        .then(resp => {
            const followers = resp.data
            setFollowers(followers)
        })
        .catch(err => {
            showMessage('error', 'Erro ao selecionar seguidores. Contate o administrador!')
            console.log('Erro ao selecionar seguidores. Verifique o log do servidor.')
        })
    }

    function getFollowings() {
        const userId = profileLoggedUser.id
        axios.get(`${API_URL}/connections/following/` + userId, { headers: {"Authorization": user.token} })
        .then(resp => {
            const followings = resp.data
            setFollowings(followings)
        })
        .catch(err => {
            showMessage('error', 'Erro ao selecionar quem o usuário segue. Contate o administrador!')
            console.log('Erro ao selecionar quem o usuário segue. Verifique o log do servidor.')
        })
    }

    function removeConnection(writerId, connectionWriterName) {
        const msg = 'Tem certeza que você quer deixar de seguir ' + connectionWriterName + '?'
        showModal(<Confirmation message={msg} confirm={() => {confirmRemove(writerId)}} 
        close={() => closeModal()} cancel={() => closeModal()}/>, 'center')
    }

    function confirmRemove(writerId) {
        axios.delete(`${API_URL}/connections/${writerId}`, { headers: {"Authorization": user.token} })
        .then(resp => {
            showMessage('info', 'Agora você não está mais seguindo esse escritor.')
        })
        .catch(err => {
            showMessage('error', 'Erro ao tentar remover conexão. Contate o administrador!')
        })
        closeModal()
        setInit(init + 1)
    }

    return (
        <div className='Connections'>
            <div className='connections-main'>
                <h2>Gerencie suas conexões</h2>
                <div className='div-title-follow'>Você possui <strong>{followers.length}</strong> seguidor(es)!</div>
                <div className='div-title-follow'>Você está seguindo <strong> {followings.length} </strong> escritor(es)!</div>
            </div>
            <div className={`div-following-list ${followings.length > 0 ? 'visible' : 'hidden'}`}>
                <div className='div-title-following-list'>Escritor(es) que você segue:</div>
                {followings.map(following => {
                    return <ConnectionItem following={following} removeConnection={removeConnection}/>
                })
                }
            </div>
        </div>
    )
}

export default Connections