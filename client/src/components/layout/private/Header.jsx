import React from 'react'
import { Nav } from './Nav'
import { NavLink } from 'react-router-dom'
export const Header = () => {
  return (
    <header className='layout__navbar'>
      <div className='navbar__header'>
        <NavLink to='/' className='navbar__title'>
          REACTSOCIAL
        </NavLink>
      </div>
      <Nav />
    </header>
  )
}
