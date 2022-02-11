import axios from "axios"
import {OPEN_API_URL} from '../../data/Consts'

const OPEN_URL = `${OPEN_API_URL}/categories`

export const getCategoriesWithChildren = () => {
    return new Promise((resolve, reject) => {
        axios.get(OPEN_URL)
        .then(resp => {
            let rootCategoriesTemp = []
            let categoriesChildren = []
            let arrayOfRootIndex = []
            resp.data.forEach(category => {
                if (category.categoryParent != null) {
                    categoriesChildren.push(category)
                } else {
                    rootCategoriesTemp.push({category, children: []})
                    arrayOfRootIndex.push(category.id)
                }
            })
            //setRootCategories(rootCategoriesTemp)
            categoriesChildren.forEach(child => {
                const indexOfRoot = arrayOfRootIndex.indexOf(child.categoryParent)
                if (indexOfRoot > -1) {
                    rootCategoriesTemp[indexOfRoot].children.push(child)
                } else {
                    reject({error: `ERRO ====> Category parent ${child.categoryParent} não encontrada.`})
                }
            })
            // categories array, error
            resolve(rootCategoriesTemp)
        })
        .catch(error => {   
            // categories array, error      
            reject({error: error.message})  
        })
    })
}
