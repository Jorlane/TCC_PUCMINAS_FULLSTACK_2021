import './CategoryForm.css'

import React, { useState, useContext, useEffect } from 'react'
import { formatDateFromDateTime } from '../../utils/utils'
import Message from '../util/Message'
import { getCategoriesWithChildren } from './CategoryUtil'
import { AppContext } from '../../data/Store'

const initCategory = {
    name: '',
    categoryParent: null,
    initDate: null,
    endDate: null
}

const CategoryForm = props => {
    const [category, setCategory] = useState(props.category || initCategory)
    const [categoryParent, setCategoryParent] = useState(props.category.categoryParent || '')
    const [categories, setCategories] = useState([])
    const [refresh, setRefresh] = useState(0)
    const {showMessage} = useContext(AppContext)

    useEffect( () => {
        getCategories()
    }, [refresh])

    function handleChangeCategoryName(e) {
        if (e.target.id === 'input-name-category' && !props.readOnly) {
            setCategory({...category, name: e.target.value}) 
        }
    }

    function getCategories() {
        getCategoriesWithChildren()
            .then(result => {
                setCategories(result)
            })
            .catch(error => showMessage('error', error.message))
    }

    function saveCategory() {
        if (props.saveCategory) {
            const categoryTemp = category
            if (categoryParent === '') {
                categoryTemp.categoryParent = null 
            } else {
                categoryTemp.categoryParent = categoryParent
            }
            setCategory(categoryTemp)
            props.saveCategory(category)
            clearForm()
        }
    }

    function clearForm() {
        setCategory(initCategory)
        setCategoryParent('')
        setPlaceHolderAtCategoryParent(document.getElementById('select-category'), '')
        setRefresh(refresh + 1)
        const inputName = document.getElementById('input-name-category')
        inputName.focus()
    }

    function handleChangeCategorySelect(e) {
        if (e) {
            const selectCategory = e.target
            setPlaceHolderAtCategoryParent(selectCategory)
            if (!props.readOnly) {
                setCategoryParent(selectCategory.value)
            }
        }
    }

    function setPlaceHolderAtCategoryParent(selectCategory) {
        if (selectCategory.value === '') {
            if (!selectCategory.classList.contains('place-holder')) {
                selectCategory.classList.add('place-holder')
            } 
        } else { 
            selectCategory.classList.remove('place-holder')
        }
    }

    function handleCategoriesChange() {
        console.log('Mudou a lista de categorias')
    }
    
    return (
        <div className={props.readOnly ? 'CategoryForm color-readonly' : 'CategoryForm color-updatable'}>
            <div className='header-form'>
                <div className='form-title'>{props.title || 'Formulário Categoria'}</div>
                <button className='btn-exit' onClick={props.close}>
                    <span className="material-icons-outlined">close</span>
                </button>
            </div>

            <form className='form'>
                <div className="form-fields">
                    <label htmlFor="name">Nome da categoria</label>
                    <input id='input-name-category' placeholder='Nome da categoria...' type="text" name='name' autoComplete="off" onChange={e => handleChangeCategoryName(e)} value={category.name}/>
                    
                    <label htmlFor="init-date" visible={props.readOnly ? 'visible' : 'hidden'}>Data de início</label>
                    <input id='input-init-date-category' visible={props.readOnly ? 'visible' : 'hidden'} type="text" name='init-date' readOnly value={formatDateFromDateTime(category.initDate)}/>

                    <label htmlFor="categories">Categoria Agrupadora</label>
                    <select className='select-parent-category place-holder' id='select-category' name="categories" onChange={e => handleChangeCategorySelect(e)} value={categoryParent}>
                        <option value="" >(Sem categoria agrupadora)</option>
                        {categories.map(item => {
                            if (item.category.categoryParent === null) {
                                return <option key={item.category.id} value={item.category.id}>{item.category.name}</option>
                            } else {
                                return ''
                            }
                        })}
                    </select>
                </div>
                <div className='buttons-form' visible={props.readOnly ? 'hidden' : 'visible'}>
                    <span className='btn-form btn-form-clear'  onClick={clearForm}>Limpar</span>
                    <span className='btn-form btn-form-save'  onClick={saveCategory}>Adicionar</span>
                </div>
                <Message />
            </form>
        </div>
    )
}

export default CategoryForm