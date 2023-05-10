import React from 'react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'
import { Aside } from './Aside'

export const PrivateLayout = () => {
  return (
    <>
      <Header />
      <section className='layout__content'>
        <Outlet />
      </section>
      <Aside />
    </>
  )
}
