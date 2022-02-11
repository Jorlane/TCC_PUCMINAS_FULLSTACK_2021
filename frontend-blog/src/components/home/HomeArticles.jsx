import './HomeArticles.css'

import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

import HomeArticlesItem from './HomeArticlesItem'

import { OPEN_API_URL } from '../../data/Consts'

const URL = `${OPEN_API_URL}/articles`
const URL_USERS = `${OPEN_API_URL}/users`

const HomeArticles = props => {
    const [articles, setArticles] = useState([])
    const [refresh] = useState(props.refresh || true)
    const navigate = useNavigate()
    
    useEffect( () => {
        async function start() {
            await getArticles()
        }
        start()
        
    }, [refresh])

    function handleClickArticleItem(article) {
        navigate(`/articleview?param=${article.id}`)
    }

    async function getArticles() {
        let urlToFindArticles = URL
        if (props.writerIdOnly) {
            urlToFindArticles = `${URL}/bywriter/${props.writerIdOnly}`
        }
        console.log('Vai selecionar artigos url: ', urlToFindArticles)

        await axios.get(urlToFindArticles)
        .then(async resp => {
            if (resp.status === 200) {
                let list = resp.data
                for (let i = 0; i < list.length; i++) {
                    await axios.get(`${URL_USERS}/${list[i].writerId}`)
                        .then(respUser => {
                            const writer = respUser.data
                            list[i].writer = writer
                        })
                }
                setArticles(list)
            } else {
                setArticles([])
            }
        })
        .catch(error => {  
            console.log('Erro ao selecionar articles => ', error)        
        })
    }

    return (
        <div className='HomeArticles'>
            <div className='list-home-articles'>
                {articles.map((article, position) => 
                    <HomeArticlesItem key={`item_${position}`} article={article}  handleClickArticleItem={handleClickArticleItem}/>
                )}
            </div>
        </div>
    )
}

export default HomeArticles