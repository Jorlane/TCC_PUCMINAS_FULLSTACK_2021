import './CategoryList.css'
import { API_URL, OPEN_API_URL} from '../../data/Consts'

import React, { useContext, useEffect, useState } from  'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

import CategoryListItem from './CategoryListItem'
import CategoryForm from './CategoryForm'
import { AppContext } from '../../data/Store'
import Confirmation from '../util/Confirmation'
import { getCategoriesWithChildren } from './CategoryUtil'

const URL = `${API_URL}/categories`
const OPEN_URL = `${OPEN_API_URL}/categories`

const CategoryList = props => {
    const [rootCategories, setRootCategories] = useState([])
    const [categories, setCategories] = useState([])
    const [refresh] = useState(props.refresh || true)
    const {showModal, closeModal, showMessage, user, setToolBarContent} = useContext(AppContext)
    const navigate = useNavigate()

    useEffect( () => {
        getCategories()
        setToolBarContentByCategory() 
        
        function setToolBarContentByCategory() {
            setToolBarContent(
                <div className='category_toolbar'>
                    <button className="button-back button_icon" onClick={handleClickGoBack}>
                        <span className='material-icons-outlined'>
                            arrow_back
                        </span>
                    </button>
                    <div> Cadastro de Categoria </div>
                </div>
            )
        }
    }, [refresh, user.token])

    function handleClickGoBack() {
        const history = window.history
        history.back()
    }
   

    function getCategories() {
        getCategoriesWithChildren()
            .then(result => {
                console.log('result ====> ', result)
                setRootCategories(result)
                setCategories(result)
            })
            .catch(error => showMessage('error', error.message))
    }

    function handleClickListItem(category) {
        showModal(<CategoryForm title='Consulta Categoria' close={closeFormCategory} 
            readOnly='true' category={category} categories={rootCategories}/>, 'center')
    }

    function saveCategory(category) {
        axios.post(URL, category, { headers: {"Authorization": user.token} } )
          .then(function (response) {
            showMessage('info', 'Registro incluído com sucesso!')
            getCategories()
          })
          .catch(function (error) {
            showMessage('error', error.response.data.message)
          });
    }

    function closeFormCategory() {
        closeModal()
    }

    function showFormAddCategory() {
        showModal(<CategoryForm title='Adicionar Categoria' close={closeFormCategory} saveCategory={saveCategory} category={{}} categories={rootCategories}/>, 'center')
    }

    function handleRemoveListItem(category) {
        const msg = 'Tem certeza que deseja excluir a categoria "' + category.name + '"? '
        showModal(<Confirmation message={msg} confirm={() => confirmDelete(category.id)} 
        close={() => closeModal()} cancel={() => closeModal()}/>, 'center')
    }

    function confirmDelete(id) {
        axios.delete(`${URL}/${id}`, { headers: {"Authorization": user.token} } )
        .then(resp => {
            showMessage('info', 'Registro excluído com sucesso!')
            getCategories()
        })
        .catch(error => {  
            showMessage('error', error.response.data.message)              
        })

        closeModal()
    }

    return (
        <div className='CategoryList'>
            <div className='list-category'>
                <div className='list-title'>
                    <div className='title-expand'><span className="material-icons-outlined">expand_more</span></div>
                    <div className='title-category'>Categoria</div>
                    <div className='title-date'>Início</div>
                    <div className='title-action'><span className="material-icons-outlined">delete</span></div>
                </div>
                
                <ul>
                    {categories.map((item, position) => 
                            <CategoryListItem key={item.category.id.toString()} listItemKey={position.toString()} 
                                item={item} 
                                position={position} handleClickListItem={handleClickListItem}
                                handleRemoveListItem={handleRemoveListItem}/>
                    )}
                </ul>
            </div>
            <button id='button-add-category' className="btn-add-item material-icons-outlined" 
                    onClick={() => showFormAddCategory()}>
                add_circle_outline
            </button>
            
        </div>
    )
}

export default CategoryList