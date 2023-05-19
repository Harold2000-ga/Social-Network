import React from 'react'
import { Header } from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import { Aside } from './Aside'
import useAuth from '../../../hooks/useAuth'

export const PrivateLayout = () => {
  const { auth, loading } = useAuth()

  if (loading) {
    return (
      <section className='layout__content'>
        <div className='layout__loading'>
          <i className='layout__loading--spin fas fa-spinner fa-spin fa-3x  '></i>
        </div>
      </section>
    )
  } else {
    return (
      <>
        <Header />
        <section className='layout__content'>
          {auth._id ? <Outlet /> : <Navigate to='/login' />}
        </section>
        <Aside />
      </>
    )
  }
}
