import './ToolbarArticle.css'

import React from 'react'


const ToolbarArticle = props => {

    function handleButtonAdd() {
        const buttonsSection = document.getElementById(`btn-section-${props.itemId}`)
        buttonsSection.classList.toggle('active')
    }

    return (
        <div className='ToolbarArticle' id={`toolbar-${props.itemId}`}>
            {props.isRemoveButtonVisible &&
                <button className='button-remove-section material-icons-outlined' onClick={()=> props.handleRemoveSection(props.itemId)}>
                    remove_circle_outline
                </button>
            }

            <button className='button-add-section material-icons-outlined' onClick={handleButtonAdd}>
                add_circle_outline
            </button>
            <div className='buttons-section' id={`btn-section-${props.itemId}`}>
                <button title='Subtítulo'  className='btn-toolbar btn-subtitle material-icons-outlined' 
                    onClick={() => props.handleAddSection('caption', props.divParent)} >
                    short_text 
                </button>
                <button title='Imagem' className='btn-toolbar btn-picture material-icons-outlined' 
                    onClick={() => props.handleAddSection('image', props.divParent)}>
                    image
                </button>
                <button title='Parágrafo' className='btn-toolbar btn-paragraph material-icons-outlined' 
                    onClick={() => props.handleAddSection('paragraph', props.divParent)}>
                    notes
                </button>
                <button title='Lista' className='btn-toolbar btn-list material-icons-outlined' 
                    onClick={() => props.handleAddSection('list', props.divParent)}>
                    list
                </button>
                <button title='Citação' className='btn-toolbar btn-quote material-icons-outlined'
                    onClick={() => props.handleAddSection('quote', props.divParent)}>
                    format_quote
                </button>
                <button title='Código-fonte' className='btn-toolbar btn-code material-icons-outlined'
                    onClick={() => props.handleAddSection('code', props.divParent)}>
                    code
                </button>
            </div>
        </div>
    )
}
export default ToolbarArticle