import './Content.css'

import React from 'react'
import {Routes, Route} from 'react-router'

import Header from './Header'

import CategoryList from '../components/category/CategoryList'
import Profile from '../components/profile/Profile'
import BlogPreferences from '../components/blog/BlogPreferences'
import Home from '../components/Home'
import Login from '../components/auth/Login'
import Signup from '../components/auth/Signup'
import Logout from '../components/auth/Logout'
import Article from '../components/article/Article'
import MyArticles from '../components/article/MyArticles'

import AdminRoute from '../components/auth/AdminRoute'
import PrivateRoute from '../components/auth/PrivateRoute'
import Indicators from '../components/indicators/indicators'
import Connections from '../components/connections/connections'
import ArticleView from '../components/home/ArticleView'

const Content = props => {
    return (
        <div className='Content'>
            <Header />
            <Routes>
                <Route path='/' element={<Home/>} />

                {/* Admin Routes */}
                <Route path='categories' element={<AdminRoute element={<CategoryList />} />}/>

                {/* Private Routes */}
                <Route path='profile' element={<PrivateRoute element={<Profile />} />} />
                <Route path='blogpreferences' element={<PrivateRoute element={<BlogPreferences />} />} />
                <Route path='indicators' element={<PrivateRoute element={<Indicators />} />} />
                <Route path='connections' element={<PrivateRoute element={<Connections />} />} />
                <Route path='article' element={<PrivateRoute element={<Article />} />} />
                {/* <Route path='article/:id' element={<PrivateRoute element={<Article />} />} /> */}
                <Route path='myarticles' element={<PrivateRoute element={<MyArticles />} />} />

                {/* Public Routes */}
                <Route path='articleview' element={<ArticleView />} />
                <Route path='login' element={<Login />}/>
                <Route path='signup' element={<Signup />}/>s
                <Route path='logout' element={<Logout />}/>
            </Routes>
        </div>
    )
}

export default Content