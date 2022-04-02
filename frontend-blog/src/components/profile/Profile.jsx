import './Profile.css'

import React, { useContext, useState, useRef, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

import { AppContext } from '../../data/Store'
import { API_URL, OPEN_API_URL, IMAGE_URL_API , IMAGE_PROFILE_DEFAULT} from '../../data/Consts'
import Confirmation from '../util/Confirmation'

import { formatDateFromDateTime } from '../../utils/utils'
const FormData = require('form-data');

const URL = `${API_URL}/users`
const URL_IMAGE = `${OPEN_API_URL}/users/profile/image`
let isUpdated = false

const Profile = props => {

    const {profileLoggedUser, user, showMessage, updateLoggedUser, setToolBarContent, setFooterContent, showModal, closeModal} = useContext(AppContext)
    const [userForm, setUserForm] = useState(profileLoggedUser)
    const filesElement = useRef(null)
    const [initLoad] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        setToolBarContentByProfile()
        setFooterContentByProfile()
        isUpdated = false
    }, [initLoad])

    function handleChange(e, key) {
        isUpdated = true
        setUserForm({
            ...userForm, 
            [key]: e.target.value
        })
    }

    function handleChangeCheckBox(e, key, type) {
        isUpdated = true
        setUserForm({
            ...userForm, 
            [key]: e.target.checked 
        })
    }

    function handleClickToolBarButton(activeDivId, navigateTo) {
        const divs = document.getElementsByClassName('tab_icon_title')
        for (let i = 0; i < divs.length; i++) {
            divs[i].classList.remove('active')
        }
        const divToActivate = document.getElementById(activeDivId)
        divToActivate.classList.add('active')

        if (navigateTo) {
            navigate(navigateTo)
        }
    }

    function setToolBarContentByProfile() {
        setToolBarContent(
            <div className='profile_toolbar'>
                <div id='tab_profile' className='tab_icon_title active'>
                    <button className="button_icon material-icons-outlined" onClick={() => handleClickToolBarButton('tab_profile', '/blog-jorlane/profile')}>
                        person
                    </button>
                    <span>Perfil</span>
                </div>
                <div id='tab_blog' className='tab_icon_title'>
                    <button className="button_icon material-icons-outlined" onClick={() => handleClickToolBarButton('tab_blog', '/blog-jorlane/blogpreferences')}>
                        menu_book
                    </button>
                    <span>Blog</span>
                </div>
                <div id='tab_indicators' className='tab_icon_title'>
                    <button className="button_icon material-icons-outlined" onClick={() => handleClickToolBarButton('tab_indicators', '/blog-jorlane/indicators')}>
                        bar_chart
                    </button>
                    <span>Indicadores</span>
                </div>
                {/* <Link className="button-link" >
                    <span className="material-icons-outlined"> library_books </span>
                    <label>Meus Artigos</label>
                </Link> */}
                <div id='tab_my_articles' className='tab_icon_title' onClick={() => handleClickToolBarButton('tab_my_articles', '/blog-jorlane/myarticles')}>
                    <button className="button_icon material-icons-outlined" >
                        library_books
                    </button>
                    <span>Artigos</span>
                </div>
                <div id='tab_connections' className='tab_icon_title'>
                    <button className="button_icon material-icons-outlined" onClick={() => handleClickToolBarButton('tab_connections', '/blog-jorlane/connections')}>
                        people
                    </button>
                    <span>Conexões</span>
                </div>

            </div>
        )
    }

    function setFooterContentByProfile() {
        setFooterContent(
            <div className='profile_footer'>
                <div id='btn-cancel-update' className='button-link'>
                    <button className="button_icon material-icons-outlined" onClick={cancelChanges}>
                        close
                    </button>
                    <span>Cancelar</span>
                </div>
                <div id='btn-save-profile' className='button-link' onClick={saveProfile}>
                    <button className="button_icon material-icons-outlined" >
                        done
                    </button>
                    <span>Salvar alterações</span>
                </div>
            </div>
        )
    }

    function saveProfile() {
        const newUser = userForm

        newUser.name = document.getElementById('input-name').value
        newUser.bioDescription = document.getElementById('input-biodescription').value
        newUser.allowEmailNotification = document.getElementById('input-allowemail').checked
        newUser.frequencyEmailNotification = document.getElementById('input-frequency').value

        if (filesElement.current.files.length >= 1) {
            const dataForm = new FormData()
            for (const file of filesElement.current.files) {
                dataForm.append('file', file)
            }
            axios.post(URL_IMAGE, dataForm)
                .then(res => {
                    newUser.photo = res.data.filename
                    save(newUser)
                })
        } else {
            save(newUser)
        }

        function save(newUser) {
            axios.put(URL, newUser, { headers: { "Authorization": user.token } })
                .then(resp => {
                    const payload = {
                        userProfile: newUser,
                        token: user.token,
                        validToken: user.validToken
                    }
                    updateLoggedUser(payload)
                    showMessage('info', resp.data.message)
                })
                .catch(function (error) {
                    showMessage('error', error.response.data.message)
                })
        }

        isUpdated = false
    }

    function cancelChanges() {
        if (isUpdated) {
            const msg = 'Tem certeza que deseja sair da tela e cancelar as alterações efetuadas? '
            showModal(<Confirmation message={msg} confirm={() => {navigate('/blog-jorlane/'); closeModal()}} 
            close={() => closeModal()} cancel={() => closeModal()}/>, 'center')
        } else {
            navigate('/blog-jorlane/')
        }
        
    }

    function handleSelectImage() {
        isUpdated = true
        const selectFileImage = document.getElementById('select-file-image')
        selectFileImage.click()
        selectFileImage.addEventListener("change", function(){
            if(selectFileImage.files.length > 0) {
                var file = new FileReader()
                file.onloadend = function(e) {
                    document.getElementById("image-profile").src = e.target.result
                };       
                file.readAsDataURL(selectFileImage.files[0])
            }
        });
    }

     return (
         <div className="Profile">
            <div className='profile-content'>
                <form action="">
                    <div className='div-info-profile'>
                        <p>{userForm.email}</p>
                        <p>Inscrito desde: {formatDateFromDateTime(userForm.firstAccess)}</p>
                    </div>
                    
                    <div className='div-img-profile'>
                        <img  id='image-profile' src={`${IMAGE_URL_API}/${userForm.photo || IMAGE_PROFILE_DEFAULT}`} alt="Imagem de perfil" onClick={handleSelectImage}/>
                        <span id='btn-img-profile' className="material-icons-outlined" onClick={handleSelectImage}>
                            photo_camera
                        </span>
                    </div>
                    <input id='select-file-image' type="file" accept="image/png, image/jpeg, image/jpg" ref={filesElement}/>
                    <label htmlFor="">Nome:</label>
                    <input id='input-name' type="text" maxLength="20" onChange={(e => handleChange(e, 'name'))} value={userForm.name}/>
                    
                    <label htmlFor="">Descrição:</label>
                    <textarea id='input-biodescription' type="text" rows="3" onChange={(e => handleChange(e, 'bioDescription'))}  value={userForm.bioDescription}/>
                    
                    <div className='div-field-profile'>
                        <label htmlFor="">Notificações por email?</label>
                        <input id='input-allowemail' className='check-box' type="checkbox" onChange={e => handleChangeCheckBox(e, 'allowEmailNotification')} checked={userForm.allowEmailNotification}/>
                        <div className="custom-select" >
                            <select id='input-frequency' className={`frequency-select ${userForm.allowEmailNotification ? 'active' : ''}`} 
                                    onChange={e => handleChange(e, 'frequencyEmailNotification')} 
                                    value={userForm.frequencyEmailNotification}>
                                <option value="SEMANAL">Semanal</option>
                                <option value="QUINZENAL">Quinzenal</option>
                                <option value="MENSAL">Mensal</option>
                            </select>
                        </div>
                    </div>
                </form>
                <a href='#' id='btn-remove-profile'>Quero encerrar minha conta</a>
            </div>
         </div>
     )
 }

 export default Profile