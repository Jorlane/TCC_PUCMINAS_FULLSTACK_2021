import './BlogPreferences.css'

import React, { useEffect, useContext } from 'react'

import { AppContext } from '../../data/Store'

const BlogPreferences = props => {
    const {setFooterContent} = useContext(AppContext)

    useEffect(() => {
        setFooterContentByBlog()
    })

    function setFooterContentByBlog() {
        setFooterContent(
            null
        )
    }

    return (
        <div className='BlogPreferences'>
            <h2>Preferências do blog </h2>
            <h3>(Em desenvolvimento)</h3>
        </div>
    )
}

export default BlogPreferences