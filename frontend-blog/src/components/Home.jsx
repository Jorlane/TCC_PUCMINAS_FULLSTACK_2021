import './Home.css'

import React, {useContext, useEffect, useState} from  'react'
import { AppContext } from '../data/Store'
import HomeArticles from './home/HomeArticles'

const Home = props => {

    const {setToolBarContent, setFooterContent} = useContext(AppContext)
    const [refresh] = useState(true)

    useEffect(() => {
        setToolBarContent(null)
        setFooterContent(null)
    }, [refresh])

    return (
        <div className='Home'>
            <HomeArticles />
        </div>
    )
}

export default Home

