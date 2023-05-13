import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '../components/layout/public/publicLayout'
import { Login } from '../components/user/Login'
import { Register } from '../components/user/Register'
import { PrivateLayout } from '../components/layout/private/PrivateLayout'
import { Feed } from '../components/publication/Feed'
import { AuthProvider } from '../context/authProvider'
import { Logout } from '../components/user/Logout'
import { People } from '../components/user/People'
import { Config } from '../components/user/Config'
export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path='/' element={<PublicLayout />}>
            <Route index element={<Login />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
          </Route>
          {/* Private */}
          <Route path='/social' element={<PrivateLayout />}>
            <Route index element={<Feed />} />
            <Route path='feed' element={<Feed />} />
            <Route path='logout' element={<Logout />} />
            <Route path='people' element={<People />} />
            <Route path='config' element={<Config />} />
          </Route>

          <Route
            path='*'
            element={
              <p>
                <h1>Error 404</h1>
                <Link to='/'>Go to Home</Link>
              </p>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
