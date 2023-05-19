import React from 'react'
import useAuth from '../../../hooks/useAuth'
import { Avatar } from './Avatar'
import { Link } from 'react-router-dom'

export const Aside = () => {
  const { auth, counters } = useAuth()

  return (
    <aside className='layout__aside'>
      <header className='aside__header'>
        <h1 className='aside__title'>Hi, {auth.name}</h1>
      </header>

      <div className='aside__container'>
        <div className='aside__profile-info'>
          <div className='profile-info__general-info'>
            <div className='general-info__container-avatar'>
              <Avatar className='container-avatar__img' item={auth} />
            </div>

            <div className='general-info__container-names'>
              <a href='#' className='container-names__name'>
                {auth.name} {auth.surname}
              </a>
              <p className='container-names__nickname'>{auth.nickname}</p>
            </div>
          </div>

          <div className='profile-info__stats'>
            <div className='stats__following'>
              <Link to={`followers/${auth._id}`} className='following__link'>
                <span className='following__title'>Followers</span>
                <span className='following__number'>{counters.followed}</span>
              </Link>
            </div>
            <div className='stats__following'>
              <Link to={`following/${auth._id}`} className='following__link'>
                <span className='following__title'>Following</span>
                <span className='following__number'>{counters.following}</span>
              </Link>
            </div>

            <div className='stats__following'>
              <a href='#' className='following__link'>
                <span className='following__title'>Publications</span>
                <span className='following__number'>{counters.publications}</span>
              </a>
            </div>
          </div>
        </div>

        <div className='aside__container-form'>
          <form className='container-form__form-post'>
            <div className='form-post__inputs'>
              <label htmlFor='post' className='form-post__label'>
                ¿What are you thinking today?
              </label>
              <textarea name='post' className='form-post__textarea'></textarea>
            </div>

            <div className='form-post__inputs'>
              <label htmlFor='image' className='form-post__label'>
                Upload image
              </label>
              <input type='file' name='image' className='form-post__image' />
            </div>

            <input type='submit' value='Send' className='form-post__btn-submit' disabled />
          </form>
        </div>
      </div>
    </aside>
  )
}
