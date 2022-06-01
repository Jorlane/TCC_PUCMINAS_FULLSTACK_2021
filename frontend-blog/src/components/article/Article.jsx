import './Article.css'

import React, {useContext, useEffect, useState} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../data/Store'
import { getCategoriesWithChildren } from '../category/CategoryUtil'
import ToolbarArticle from './ToolbarArticle'
import Paragraph from './Paragraph'
import Title from './Title'
import { API_URL } from '../../data/Consts'
import Caption from './Caption'
import Image from './Image'
import List from './List'
import Quote from './Quote'
import SourceCode from './SourceCode'

const URL = `${API_URL}/articles`
const URL_SECTION = `${API_URL}/sectionInArticle`

let sequenceId = 0;

let initialArticle = {
    id: null,
    writerId: null,
    title: '',
    categoryId: null,
    htmlFilePath: "sem html",
    route: "sem rota"
}

let articleToEdit = {...initialArticle}

let pendingImages = []
let imageFilesToRemove = []
let controlCallbackList = []

const Article = props => {

    const {setFooterContent, user, profileLoggedUser, showMessage, setToolBarContent} = useContext(AppContext)
    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState(null)
    const [init] = useState(true)

    useEffect( async () => {
        pendingImages = []
        controlCallbackList = []
        articleToEdit = {...initialArticle}

        const param = window.location.search
        if (param && param.trim() != '') {
            const articleId = param.replace('?param=', '').trim()
            if (articleId != null && articleId != '') {
                await getArticleToEdit(articleId)
            }
        } 
        addTitle(articleToEdit.title)

        setFooterContentByArticle()
        getCategoriesWithChildren()
            .then(result => {
                let categoriesTemp = []
                result.forEach(category => {
                    categoriesTemp.push(category.category)
                    if (category.children) {
                        category.children.forEach(child => {
                            categoriesTemp.push(child)
                        })
                    }
                })
                setCategories(categoriesTemp)
            })
        .catch(error => console.log('Erro ao ler categorias: ', error.message))
        // if (!articleToEdit.id) {
        //     saveArticle()
        // }
    }, [init])

    async function getArticleToEdit(articleId) {
        await axios.get(`${URL}/${articleId}`, { headers: {"Authorization": user.token} } )
            .then(resp => {
                articleToEdit = {
                    id: resp.data.id,
                    writerId: resp.data.writerId,
                    title: resp.data.title,
                    categoryId: resp.data.categoryId,
                    status: resp.data.status, 
                    statusDate: resp.data.statusDate,
                    htmlFilePath: resp.data.htmlFilePath,
                    route: resp.data.route
                }

                setCategoryId(resp.data.categoryId)
                const sections = resp.data.sectionsinarticles
                sections.map(section => {
                    addSectionToArticle(section.sectionId.toUpperCase(), null, section)
                })
            })
            .catch(error => {
                console.log('error ====> ', error)
            })
    }

    function saveArticle(prevStatusParam) {
        const titleElement = document.getElementById('title')

        if (titleElement) {
            articleToEdit.title = titleElement.value
        }

        const prevStatus = prevStatusParam || articleToEdit.status
        if (articleToEdit.status === 'RETIRADO') {
            articleToEdit.status = 'RASCUNHO'
        }

        if (articleToEdit.id) {
            axios.put(URL, articleToEdit, { headers: {"Authorization": user.token} } )
                .then(resp => {
                    if (prevStatus === 'RETIRADO') {
                        if (articleToEdit.status === 'PUBLICADO') {
                            showMessage('info', 'Artigo republicado sem alteração!')
                        } else {
                            showMessage('info', 'Artigo salvo como rascunho!')
                        }
                    } else {
                        saveSectionsInArticle(articleToEdit.id)
                        showMessage('info', 'Artigo salvo com sucesso!')
                    }
                    removeImageFilesFromServer()
                })
                .catch(error => {
                    showMessage('error', 'Erro ao salvar artigo: Contate administrador!')
                    console.log('Erro: ', error.response.data.message)
                })
        } else {
            articleToEdit.writerId = profileLoggedUser.id
            axios.post(URL, articleToEdit, { headers: {"Authorization": user.token} } )
                .then(resp => {
                    articleToEdit.id = resp.data.id
                    saveSectionsInArticle(resp.data.id)
                    showMessage('info', 'Artigo salvo com sucesso!')
                })
                .catch(error => {
                    showMessage('error', 'Ocorreu um erro. Contate o Administrador!')
                    console.log('Erro: ', error.response.data.message)
                })
        }
    }

    function removeImageFilesFromServer() {
        if (imageFilesToRemove && imageFilesToRemove.length > 0) {
            axios.post(`${URL_SECTION}/images`, imageFilesToRemove, { headers: {"Authorization": user.token} } )
            .then(resp => {
                imageFilesToRemove = []
            })
            .catch(error=> {
                showMessage('error', 'Ocorreu um erro. Contate o administrador!')
            })
        }
    }

    function saveSectionsInArticle(articleId) {
        pendingImages = []
        axios.delete(`${URL}/sections/${articleId}`, { headers: {"Authorization": user.token} } )
        .then(resp => {
            insertSections(articleId)
        })
        .catch(error => {  
            console.log('Ocorreu um erro ao salvar o artigo. Contate o administrador!', error)        
        })
    }

    function uploadImage(section, articleId, sequence) {
        const sectionId = section.getAttribute('id')
        const buttonUploadId = section.getAttribute('buttonupload')
        const buttonUpload = document.getElementById(buttonUploadId)
        const pendingImage = {
            sectionId,
            articleId,
            sequence 
        }
        pendingImages.push(pendingImage)
        buttonUpload.click()
    }

    function saveImageFileName(sectionId, imageFileName, text) {
        for (let i = 0; i < pendingImages.length; i++) {
            if (pendingImages[i].sectionId === sectionId) {
                const sectionInArticle = {
                    articleId: pendingImages[i].articleId, 
                    sectionId: 'IMAGE',
                    text: text, 
                    imagePath: imageFileName,
                    sequence: pendingImages[i].sequence
                }
                axios.post(URL_SECTION, sectionInArticle, { headers: {"Authorization": user.token} } )
                .then(resp => {
                    console.log('SectionInArticle salvo com sucesso. ')
                })
                .catch(error=> {
                    showMessage('error', 'Ocorreu um erro. Contate o administrador!')
                })
            }
        }
    }

    function insertSections(articleId) {
        const sections = document.getElementsByClassName('Article-Section')
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i]
            const sectionType = section.getAttribute('sectiontype').toUpperCase()
            const sequence = (i + 1)
            if (sectionType === 'IMAGE') {
                uploadImage(section, articleId, sequence)
            } else {
                let value = section.getAttribute('value')
                let complement = ''
                if (sectionType === 'LIST') {
                    const itemId = section.getAttribute('itemId')
                    for (let i = 0; i < controlCallbackList.length; i++) {
                        const item = controlCallbackList[i]
                        if (item.itemId === itemId) {
                             value = item.getListFunction().join('#!#')
                        }
                    }
                } else if (sectionType === 'QUOTE') {
                    complement = section.getAttribute('author')
                }
                
                const sectionInArticle = {
                    articleId: articleId, 
                    sectionId: sectionType,
                    text: value, 
                    complement: complement,
                    sequence: sequence
                }
                axios.post(URL_SECTION, sectionInArticle, { headers: {"Authorization": user.token} } )
                .then(resp => {
                    console.log('SectionInArticle salvo com sucesso.')
                })
                .catch(error => {
                    console.log('Error => ', error.response.data.message)
                    showMessage('error', 'Ocorreu um erro. Contate o administrador!')
                })
            }
        }
    }

    function publishArticle() {
        const titleElement = document.getElementById('title')
        if (titleElement) {
            articleToEdit.title = titleElement.value
        }
        if (!articleToEdit.title || articleToEdit.title === '') {
            showMessage('error', 'Por favor, informe um título para o artigo!')
            const titleElement = document.getElementById('title')
            titleElement.focus()
        } else {
            const prevStatus = articleToEdit.status
            articleToEdit.status = 'PUBLICADO'
            saveArticle(prevStatus)
        }

    }

    function setFooterContentByArticle() {
        setFooterContent(
            <div className='profile_footer'>
                <div id='btn-undo' className='button-link'>
                    <button className="button_icon material-icons-outlined" >
                        undo
                    </button>
                    <span>Desfazer</span>
                </div>
                <div id='btn-save-draft' className='button-link'>
                    <button className="button_icon material-icons-outlined" onClick={saveArticle}>
                        save
                    </button>
                    <span>Salvar</span>
                </div>
                <div id='btn-publish' className='button-link'>
                    <button className="button_icon material-icons-outlined" onClick={publishArticle}>
                        public
                    </button>
                    <span>Publicar</span>
                </div>
                <Link className="button-link" to='/blog-jorlane/myarticles'>
                    <span className="material-icons-outlined"> library_books </span>
                    <label>Meus Artigos</label>
                </Link>
            </div>
        )
    }

    function addSectionToArticle(sectionType, prevElementId, section) {
        switch (sectionType.toUpperCase()) {
            case 'PARAGRAPH': 
                addParagraph(prevElementId, section)
                break
            case 'CAPTION': 
                addCaption(prevElementId, section)
                break
            case 'IMAGE': 
                addImage(prevElementId, section)
                break
            case 'LIST': 
                addList(prevElementId, section)
                break
            case 'QUOTE':
                addQuote(prevElementId, section)
                break
            case 'CODE':
                addSourceCode(prevElementId, section)
                break
            default:
                break
        }
    }

    function removeSectionToArticle(sectionId) {
        const divToRemove = document.getElementById('div_' + sectionId)
        const sectionType = divToRemove.getAttribute('sectiontype')
        if (sectionType && sectionType.toUpperCase() === 'IMAGE') {
            const fileName = divToRemove.getAttribute('filename')
            if (fileName && fileName != '') {
                imageFilesToRemove.push(fileName)
            }
        }
        divToRemove.remove()
    }

    function initAddSection(prevElementId, section) {
        let initText = '' 
        let complement = ''
        let imagePath = ''
        if (section) {
            initText = section.text || ''
            complement = section.complement || ''
            imagePath = section.imagePath || ''
        }
        const articleBody = document.getElementById('article-body')
        sequenceId++

        const divItem = document.createElement('div')
        const itemId = `section_${sequenceId}`
        divItem.id = 'div_' + sequenceId
        if (!prevElementId) {
            articleBody.appendChild(divItem)
        } else {
            if (prevElementId === 'div-title') {
                const firstElement = articleBody.firstElementChild
                if (firstElement) {
                    articleBody.insertBefore(divItem, firstElement)
                } else {
                    articleBody.appendChild(divItem)
                }
            } else {
                const element = document.getElementById(prevElementId)
                articleBody.insertBefore(divItem, element.nextSibling)
            }
        }
        return {divItem, sequenceId, itemId, initText, complement, imagePath}
    }

    function addParagraph(prevElementId, section) {
        const {divItem, sequenceId, itemId, initText} = initAddSection(prevElementId, section)
        ReactDOM.render(
            <Paragraph paragraph_id={sequenceId} 
                itemId={itemId} 
                divParent={divItem.id}
                onKeyUp={handleKeyUp} 
                initText={initText}
                menu={<ToolbarArticle id='nav-add-section' itemId={itemId} 
                        handleAddSection={addSectionToArticle}
                        handleRemoveSection={removeSectionToArticle}
                        isRemoveButtonVisible={true}
                        divParent={divItem.id}
                        />}/>
        , divItem)
        const paragraph = document.getElementById(itemId)
        paragraph.focus()
        return divItem.id
    }
    function addCaption(prevElementId, section) {
        const {divItem, sequenceId, itemId, initText} = initAddSection(prevElementId, section)
        
        ReactDOM.render(
            <Caption caption_id={sequenceId} 
            itemId={itemId} 
            divParent={divItem.id}
            onKeyUp={handleKeyUp} 
            initText={initText}
            menu={<ToolbarArticle id='nav-add-section' itemId={itemId} 
                    handleAddSection={addSectionToArticle}
                    handleRemoveSection={removeSectionToArticle}
                    isRemoveButtonVisible={true}
                    divParent={divItem.id}
                    />}/>
        , divItem)
        const caption = document.getElementById(itemId)
        caption.focus()
        return divItem.id
    }
    
    function addImage(prevElementId, section) {
        const {divItem, sequenceId, itemId, initText, imagePath} = initAddSection(prevElementId, section)
        ReactDOM.render(
            <Image image_id={sequenceId} 
            itemId={itemId} 
            divParent={divItem.id}
            initText={initText}
            src={imagePath}
            saveImageFileName={saveImageFileName}
            menu={<ToolbarArticle id='nav-add-section' itemId={itemId} 
                    handleAddSection={addSectionToArticle}
                    handleRemoveSection={removeSectionToArticle}
                    isRemoveButtonVisible={true}
                    divParent={divItem.id}
                    />}/>
        , divItem)
        //handleSelectImage(itemId)
        return divItem.id
    }

    function setCallbackGetList(itemId, getListFunction) {
        const itemControl = {itemId, getListFunction}
        controlCallbackList.push(itemControl)
    }

    function addList(prevElementId, section) {
        const {divItem, sequenceId, itemId, initText} = initAddSection(prevElementId, section)
        const initList = initText.split('#!#')
        
        ReactDOM.render(
            <List paragraph_id={sequenceId}  
                itemId={itemId} 
                divParent={divItem.id}
                onKeyUp={handleKeyUp}  
                initList={initList}
                setCallbackGetList={setCallbackGetList}
                handleRemoveSection={removeSectionToArticle}
                menu={<ToolbarArticle id='nav-add-section' itemId={itemId} 
                        handleAddSection={addSectionToArticle}
                        handleRemoveSection={removeSectionToArticle}
                        isRemoveButtonVisible={true}
                        divParent={divItem.id}
                        />}/>
        , divItem)
        const list = document.getElementById(itemId)
        list.click()
        return divItem.id
    }

    function addQuote(prevElementId, section) {
        const {divItem, sequenceId, itemId, initText, complement} = initAddSection(prevElementId, section)
        ReactDOM.render(
            <Quote quote_id={sequenceId} 
                itemId={itemId} 
                divParent={divItem.id}
                onKeyUp={handleKeyUp} 
                initText={initText}
                complement={complement}
                menu={<ToolbarArticle id='nav-add-section' itemId={itemId} 
                        handleAddSection={addSectionToArticle}
                        handleRemoveSection={removeSectionToArticle}
                        isRemoveButtonVisible={true}
                        divParent={divItem.id}
                        />}/>
        , divItem)
        const quote = document.getElementById(itemId)
        quote.focus()
        return divItem.id
    }

    function addSourceCode(prevElementId, section) {
        const {divItem, sequenceId, itemId, initText} = initAddSection(prevElementId, section)
        ReactDOM.render(
            <SourceCode sourcecode_id={sequenceId} 
                itemId={itemId} 
                divParent={divItem.id}
                onKeyUp={handleKeyUp} 
                initText={initText}
                menu={<ToolbarArticle id='nav-add-section' itemId={itemId} 
                        handleAddSection={addSectionToArticle}
                        handleRemoveSection={removeSectionToArticle}
                        isRemoveButtonVisible={true}
                        divParent={divItem.id}
                        />}/>
        , divItem)
        const sourceCode = document.getElementById(itemId)
        sourceCode.focus()
        return divItem.id
    }

    function handleChangeSelectCategory(e) {
        articleToEdit.categoryId = e.target.value
        setCategoryId(e.target.value)
    }

    function handleKeyUp(e, divParentId) {
        if (e.key && e.key.toUpperCase() === 'ENTER') {
            addParagraph(divParentId)
        } 
    }

    function autoResize (e) {
        if (e.target.scrollHeight > e.target.offsetHeight){
            e.target.rows++;
        }
    }

    function handleKeyPress(e) {
        if (e.key && e.key.toUpperCase() === 'ENTER') {
            e.preventDefault()
        }
    }

    async function addTitle(initTitle) {
        const divItem = document.getElementById('div-title')
        const itemId = 'title'
        await ReactDOM.render(
            <Title id='input-title'
                handleKeyUp={handleKeyUp}
                handleKeyDow={autoResize} 
                handleKeyPress={handleKeyPress}
                itemId={itemId}
                initTitle={initTitle || ''}
                divParent='div-title'
                menu={<ToolbarArticle id='nav-add-section' itemId={itemId}
                    handleAddSection={addSectionToArticle}
                    isRemoveButtonVisible={false}
                    divParent='div-title'/>}/>
        , divItem)
        let title = document.getElementById(itemId)
        if (title) {
            title.focus()
        }
        return divItem.id
    }

    return (
        <div className='Article'>
            <div className="div-category" >
                <label htmlFor='categories'> Categoria: </label>
                <select id='categories' className='category-select' onChange={handleChangeSelectCategory} value={categoryId} >
                    {categories.map(item => {
                        if (item.categoryParent) {
                            return  <option key={item.id} value={item.id}>&nbsp;&nbsp;&nbsp;&nbsp;{`${item.name}`}</option> 
                                
                        } else {
                            return <option key={item.id} value={item.id}>{item.name}</option> 
                        }
                    })}
                </select>
            </div>
            <div id='div-title'>
                
            </div>
            <div id='article-body'>
                
            </div>
        </div>
    )
}

export default Article

