import './Confirmation.css'

import React from 'react'

const Confirmation = props => {
    return (
        <div className='Confirmation'>
            <div className='header-confirmation'>
                <div className='box-title'>
                    <span className="material-icons-outlined" >help_outline</span>
                    <p className='title-message'>Confirmação</p>
                </div>
                <button className='btn-exit' onClick={props.close}>
                    <span className="material-icons-outlined">close</span>
                </button>
            </div>
            <div className="box-body-message">
                <div className='message'>
                    { props.message }
                </div>
                <div className='buttons-confirmation'>
                    <button className='btn-confirmation btn-no color-no background-no' onClick={props.cancel}>
                        <span className="material-icons-outlined">close</span>
                        Não
                    </button>
                    <button className='btn-confirmation btn-yes color-yes background-yes' onClick={props.confirm}>
                        <span className="material-icons-outlined">done</span>
                        Sim
                    </button>
                </div>
            </div>
        </div>
 
    )
}

export default Confirmation