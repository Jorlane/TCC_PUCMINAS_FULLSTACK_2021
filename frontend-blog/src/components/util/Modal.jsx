import './Modal.css'

import React, { useContext } from 'react'

import {AppContext} from '../../data/Store'

const Modal = () => {

    const {modalVisible, children, modalJustifyContent, closeModal} = useContext(AppContext)

    function handleClickOutsideModal(e) {
        if (e.target.id === 'main-modal') {
            console.log('dentro de handleClickOutsideModal')
            closeModal()
        }
    }

    return (
        <div className='Modal' modal-justify-content={modalJustifyContent} id='main-modal' visible={modalVisible} onClick={(e) => handleClickOutsideModal(e)}>
            {children}
        </div>
    )
}

export default Modal