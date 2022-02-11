import './Image.css'

import React, { useState, useRef, useEffect} from 'react'
import axios from 'axios'
import { OPEN_API_URL, IMAGE_URL_API } from '../../data/Consts'

const URL_IMAGE = `${OPEN_API_URL}/sectionInArticle/image/`

const Image = props => {
    const [text, setText] = useState(props.initText || '')
    const [src, setSrc] = useState('')
    const filesElement = useRef(null)
    const [init] = useState(true)
    const [dataFormImage, setDataFormImage] = useState(null)

    useEffect( () => {
        if (props.src && props.src != '') {
            const imageContainer = document.getElementById(`image-container-${props.itemId}`)
            imageContainer.classList.add('active')
            setSrc(`${IMAGE_URL_API}/article/${props.src}`)
        } else {
            setSrc('')
            handleSelectImage(props.itemId)
        }
    }, [init])

    function handleTextChange(e) {
        setText(e.target.value)
    }

    function showToolbar() {
        const menus = document.getElementsByClassName('item-toolbar')
        for (let i = 0; i < menus.length; i++) {
            menus[i].classList.remove('active')
        }
        
        const menu = document.getElementById(`item-toolbar-${props.image_id}`)
        menu.classList.add('active')
    }

    function handleFocusOnImage(e) {
        showToolbar()

        if (!dataFormImage) {
            if (filesElement.current.files.length >= 1) {
                const dataForm = new FormData()
                for (const file of filesElement.current.files) {
                    dataForm.append('file', file)
                }
                setDataFormImage(dataForm)
            }
        }
    }

    function handleSelectImage(itemId) {
        const selectFileImage = document.getElementById(`select-image-${itemId}`)
        selectFileImage.click()
        selectFileImage.addEventListener("change", function(){
            if(selectFileImage.files.length > 0) {
                var file = new FileReader()
                file.onloadend = function(e) {
                    const inputImage = document.getElementById(itemId)
                    inputImage.src =  e.target.result
                    inputImage.click()

                    const imageContainer = document.getElementById(`image-container-${props.itemId}`)
                    imageContainer.classList.add('active')
                    
                };       
                file.readAsDataURL(selectFileImage.files[0])
            }
        });
    }

    function uploadImage() {
        console.log('vai fazer upload da imagem')
        if (filesElement.current.files.length >= 1) {
            const dataForm = new FormData()
            for (const file of filesElement.current.files) {
                dataForm.append('file', file)
            }
            if (dataForm) {
                axios.post(URL_IMAGE, dataForm )
                    .then(res => {
                        if (props.saveImageFileName) {
                            props.saveImageFileName(`div_${props.itemId}`, res.data.filename, text)
                        }
                    })
            } 
        } else {
            console.log('vai tentar com src ==> ', props.src)
            if (props.src) {
                props.saveImageFileName(`div_${props.itemId}`, props.src, text)
            }
        }
    }

    return (
        <div className='Article-Section' sectiontype='Image' filename={props.src} value={text} buttonupload={`button-upload-${props.itemId}`}  id={`div_${props.itemId}`}>
            <div className='image-div'>
                <div className='image-container' id={`image-container-${props.itemId}`}>
                    <img className='input-image' id={props.itemId} src={src} alt={text}
                        onClick={handleFocusOnImage}/>
                    <input className='image-subtitle' type="text" placeholder='Legenda...' value={text} onChange={handleTextChange} onFocus={showToolbar}/>
                </div>
            </div>
            <form action="">
                <input className='invisible-select-image' id={`select-image-${props.itemId}`} type="file" 
                    accept="image/png, image/jpeg"  ref={filesElement}/>
            </form>
            <button className='button-upload-image' id={`button-upload-${props.itemId}`} onClick={uploadImage}>salvar imagem</button>
            <div className='item-toolbar' id={`item-toolbar-${props.image_id}`}>
                {props.menu}
            </div>
        </div>
    )
}
export default Image