import React from 'react'
import { Nav } from './Nav'
import { NavLink } from 'react-router-dom'
export const Header = () => {
  return (
    <nav className='layout__navbar'>
      <header className='navbar__header'>
        <NavLink to='/' className='navbar__title'>
          REACTSOCIAL
        </NavLink>
      </header>
      <Nav />
    </nav>
  )
}
