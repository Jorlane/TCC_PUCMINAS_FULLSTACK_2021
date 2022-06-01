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
import Connections from '../components/connections/Connections'
import ArticleView from '../components/home/ArticleView'
import ComplaintList from '../components/complaint/ComplaintList'
import BlockedUsers from '../components/blockedUsers/BlockedUsers'

const Content = props => {
    return (
        <div className='Content'>
            <Header />
            <Routes>
                <Route path='blog-jorlane/' element={<Home/>} />

                {/* Admin Routes */}
                <Route path='blog-jorlane/categories' element={<AdminRoute element={<CategoryList />} />}/>
                <Route path='blog-jorlane/complaints' element={<AdminRoute element={<ComplaintList />} />}/>
                <Route path='blog-jorlane/blockedUsers' element={<AdminRoute element={<BlockedUsers />} />}/>

                {/* Private Routes */}
                <Route path='blog-jorlane/profile' element={<PrivateRoute element={<Profile />} />} />
                <Route path='blog-jorlane/blogpreferences' element={<PrivateRoute element={<BlogPreferences />} />} />
                <Route path='blog-jorlane/indicators' element={<PrivateRoute element={<Indicators />} />} />
                <Route path='blog-jorlane/connections' element={<PrivateRoute element={<Connections />} />} />
                <Route path='blog-jorlane/article' element={<PrivateRoute element={<Article />} />} />
                {/* <Route path='article/:id' element={<PrivateRoute element={<Article />} />} /> */}
                <Route path='blog-jorlane/myarticles' element={<PrivateRoute element={<MyArticles />} />} />

                {/* Public Routes */}
                <Route path='blog-jorlane/articleview' element={<ArticleView />} />
                <Route path='blog-jorlane/login' element={<Login />}/>
                <Route path='blog-jorlane/signup' element={<Signup />}/>s
                <Route path='blog-jorlane/logout' element={<Logout />}/>
            </Routes>
        </div>
    )
}

export default Content