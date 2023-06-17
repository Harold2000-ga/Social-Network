import React, { useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { Avatar } from './Avatar'
import { Link } from 'react-router-dom'
import { Global } from '../../../helpers/Global'

export const Aside = () => {
  const { auth, counters, setCounters } = useAuth()
  const [saved, setSaved] = useState('not saved')

  const Save = e => {
    e.preventDefault()
    //Create form data and get token
    const formData = new FormData()
    const token = localStorage.getItem('token')
    //set Text
    formData.append('text', e.target.text.value)

    //Set Image
    const fileInput = document.querySelector('#fileUpload')
    formData.append('image', fileInput.files[0])

    fetch(`${Global.url}/publication/save`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 'Success') {
          setCounters({ ...counters, publications: counters.publications + 1 })
          setSaved('Saved')
        } else {
          setSaved('Error')
        }
      })
  }

  return (
    <aside className='layout__aside'>
      <header className='aside__header'>
        <h1 className='aside__title'>Hi, {auth.name}</h1>
      </header>

      <div className='aside__container'>
        <div className='aside__profile-info'>
          <div className='profile-info__general-info'>
            <div className='general-info__container-avatar'>
              <Link to={`profile/${auth._id}`}>
                <Avatar className='container-avatar__img' item={auth} />
              </Link>
            </div>

            <div className='general-info__container-names'>
              <Link to={`profile/${auth._id}`} className='container-names__name'>
                {auth.name} {auth.surname}
              </Link>
              <p className='container-names__nickname'>{auth.nickname}</p>
            </div>
          </div>

          <div className='profile-info__stats'>
            <div className='stats__following'>
              <Link to={`/social/followers/${auth._id}`} className='following__link'>
                <span className='following__title'>Followers</span>
                <span className='following__number'>{counters.followed}</span>
              </Link>
            </div>
            <div className='stats__following'>
              <Link to={`/social/following/${auth._id}`} className='following__link'>
                <span className='following__title'>Following</span>
                <span className='following__number'>{counters.following}</span>
              </Link>
            </div>

            <div className='stats__following'>
              <Link to={`/social/profile/${auth._id}`} className='following__link'>
                <span className='following__title'>Publications</span>
                <span className='following__number'>{counters.publications}</span>
              </Link>
            </div>
          </div>
        </div>

        <div className='aside__container-form'>
          {saved == 'Saved' ? (
            <strong className='alert alert_success'>Publication upload!!</strong>
          ) : (
            ''
          )}
          <form className='container-form__form-post' onSubmit={Save} id='publication-form'>
            <div className='form-post__inputs'>
              <label htmlFor='text' className='form-post__label'>
                ¿What are you thinking today?
              </label>
              <textarea name='text' className='form-post__textarea' />
            </div>

            <div className='form-post__inputs'>
              <label htmlFor='file' className='form-post__label'>
                Upload image
              </label>
              <input type='file' name='image' id='fileUpload' className='form-post__image' />
            </div>

            <input type='submit' value='Send' className='form-post__btn-submit' />
          </form>
        </div>
      </div>
    </aside>
  )
}
