import './ComplaintReason.css'

import React from 'react'


const ComplaintReason = props => {
    function validAndConfirm() {
        const reason = document.getElementById('reason')
        const alertValidationField = document.getElementById('alert-validation-id')
        if (reason.value && reason.value.trim() != '' && reason.value.trim() != '.') {
            props.confirm(props.commentId, reason.value)
        } else {
            alertValidationField.classList.add('visible')
            reason.classList.add('red-focus')
            reason.focus()
        }
    }
    return (
        <div className='ComplaintReason'>
            <div className='header-confirmation'>
                <div className='box-title'>
                    <span className="material-icons-outlined" >flag_circle</span>
                    <p className='title-message'>Denúncia do Comentário</p>
                </div>
                <button className='btn-exit' onClick={props.close}>
                    <span className="material-icons-outlined">close</span>
                </button>
            </div>
            <div className="box-body-message">
                <div className='message'>
                    { props.message }
                </div>
                <div>
                    <textarea className='text-reason' name="reason" id="reason" rows="5"></textarea>
                    <span className='alert-validation-field' id='alert-validation-id'>* por favor, informe o motivo da denúncia.</span>
                </div>
                <p className='text-info'>Fique tranquilo, o denunciante <strong> não </strong> é identificado.</p>
                <div className='buttons-confirmation'>
                    <button className='btn-confirmation btn-no color-no background-no' onClick={props.cancel}>
                        <span className="material-icons-outlined">close</span>
                        Cancelar
                    </button>
                    <button className='btn-confirmation btn-yes color-yes background-yes' onClick={validAndConfirm}>
                        <span className="material-icons-outlined">done</span>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
 
    )
}

export default ComplaintReason