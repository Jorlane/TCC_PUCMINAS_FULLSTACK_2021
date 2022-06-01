import './ConnectionItem.css'

import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'

import { formatDateFromDateTime } from '../../utils/utils'
import { AppContext } from '../../data/Store'
import { API_URL, IMAGE_URL_API, OPEN_API_URL, IMAGE_PROFILE_DEFAULT  } from '../../data/Consts'

const ConnectionItem = props => {
    const {setFooterContent, showMessage, user} = useContext(AppContext)
    const [connectionWriterName, setConnectionWriterName] = useState('nome do usuário')
    const [connectionWriterImg, setConnectionWriterImg] = useState('')
    const [connectionDate, setConnectionDate] = useState('dd/mm/yyyy')
    const [init] = useState(true)

    useEffect(() => {
        setConnectionDate(formatDateFromDateTime(props.following.startDateConnection))
        axios.get(`${OPEN_API_URL}/users/` + props.following.writerId)
        .then(resp => {
            console.log('Dentro de get Writer ===> resp.data = ', resp.data)
            if (resp.status === 200) {
                setConnectionWriterName(resp.data.name)
                setConnectionWriterImg(`${IMAGE_URL_API}/${resp.data.photo || IMAGE_PROFILE_DEFAULT}`)
            }
        })
        .catch(err => {
            showMessage('error', 'Erro ao selecionar dados do escritor. Contate o administrador!')
            console.log('Erro ao selecionar dados do escritor. Verifique o log do servidor.')
        })
    }, [init])

    return (
        <div className='ConnectionItem'>
            <div className='ConnectionItemMain'>
                <div className='leftColumnFollowing'>
                    <img className='img-view-profile-following' src={connectionWriterImg} alt="" />
                </div>
                <div className='middleColumnFollowing'>
                    <div className='div-user-connection'>{connectionWriterName} </div>
                    <div className='div-start-connection'>Seguindo desde {connectionDate}</div>
                </div>
                <div className='rightColumnFollowing'>
                    <div className='button-remove-connection' onClick={() => props.removeConnection(props.following.writerId, connectionWriterName)}>
                        <span className='material-icons-outlined'>cancel</span>
                        <span className='text-button-remove-connection'>Deixar de Seguir</span>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default ConnectionItem