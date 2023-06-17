import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Avatar } from './Avatar'

export const Nav = () => {
  const { auth } = useAuth()
  const [nav, setNav] = useState(false)
  const handleClick = () => {
    setNav(!nav)
  }

  return (
    <>
      <div className='navbar__container-lists'>
        <ul className='container-lists__menu-list'>
          <li className='menu-list__item'>
            <NavLink to='/social' className='menu-list__link'>
              <i className='fa-solid fa-house'></i>
              <span className='menu-list__title'>Home</span>
            </NavLink>
          </li>

          {/* <li className='menu-list__item'>
            <NavLink to='/social/feed' className='menu-list__link'>
              <i className='fa-solid fa-list'></i>
              <span className='menu-list__title'>Timeline</span>
            </NavLink>
          </li> */}

          <li className='menu-list__item'>
            <NavLink to='/social/people' className='menu-list__link'>
              <i className='fa-solid fa-user'></i>
              <span className='menu-list__title'>People</span>
            </NavLink>
          </li>
        </ul>

        <ul className='container-lists__list-end'>
          <li className='list-end__item'>
            <NavLink to={`profile/${auth._id}`} className='list-end__link-image'>
              <Avatar className='list-end__img' item={auth} />
            </NavLink>
          </li>
          <li className='list-end__item'>
            <NavLink to={`profile/${auth._id}`} className='list-end__link'>
              <span className='list-end__name'>{auth.name}</span>
            </NavLink>
          </li>
          <li className='list-end__item'>
            <NavLink to='/social/config' className='list-end__link'>
              <i className='fa-solid fa-gear'></i>
              <span className='list-end__name'>Setting</span>
            </NavLink>
          </li>
          <li className='list-end__item'>
            <NavLink to='/social/logout' href='#' className='list-end__link'>
              <i className='fa-solid fa-arrow-right-from-bracket'></i>
              <span className='list-end__name'>Close session</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className='menu-hamburguesa'>
        <i className='fa-solid fa-bars' onClick={handleClick}></i>
      </div>
      {nav && (
        <div className='nav-hamburguesa__shadow'>
          <div className={`nav-hamburguesa ${nav ? 'nav-hamburguesa-open' : ''}`}>
            <div className='nav-hamburguesa__header'>
              <div>
                <NavLink to={`profile/${auth._id}`} className='list-end__link-image'>
                  <Avatar className='list-end__img' item={auth} />
                </NavLink>
                <NavLink to={`profile/${auth._id}`} className='list-end__link'>
                  <span className='list-end__name'>{auth.name}</span>
                </NavLink>
              </div>

              <i className='fa-solid fa-lg fa-times' onClick={handleClick}></i>
            </div>

            <ul className='nav-hamburger_list'>
              <li className='hamburguesa__list-container' onClick={handleClick}>
                <NavLink to='/social' className='nav-hamburger_list-item'>
                  <i className='fa-solid fa-house'></i>
                  <span className='menu-list__title'>Home</span>
                </NavLink>
              </li>

              {/* <li className='hamburguesa__list-container' onClick={handleClick}>
                <NavLink to='/social/feed' className='nav-hamburger_list-item'>
                  <i className='fa-solid fa-list'></i>
                  <span className='menu-list__title'>Timeline</span>
                </NavLink>
              </li> */}

              <li className='hamburguesa__list-container' onClick={handleClick}>
                <NavLink to='/social/people' className='nav-hamburger_list-item'>
                  <i className='fa-solid fa-user'></i>
                  <span className='menu-list__title'>People</span>
                </NavLink>
              </li>

              <li className='hamburguesa__list-container' onClick={handleClick}>
                <NavLink to='/social/config' className='nav-hamburger_list-item'>
                  <i className='fa-solid fa-gear'></i>
                  <span className='list-end__name'>Setting</span>
                </NavLink>
              </li>
              <li className='hamburguesa__list-container' onClick={handleClick}>
                <NavLink to='/social/logout' href='#' className='nav-hamburger_list-item'>
                  <i className='fa-solid fa-arrow-right-from-bracket'></i>
                  <span className='list-end__name'>Close session</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
