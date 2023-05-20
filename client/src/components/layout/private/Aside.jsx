import React, { useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { Avatar } from './Avatar'
import { Link } from 'react-router-dom'
import { Global } from '../../../helpers/Global'
import { useForm } from '../../../hooks/useForm'
export const Aside = () => {
  const { auth, counters, setCounters } = useAuth()
  const { form, changed } = useForm()
  const [saved, setSaved] = useState('not saved')

  const Save = e => {
    e.preventDefault()
    const newPublication = form
    const token = localStorage.getItem('token')
    fetch(`${Global.url}/publication/save`, {
      method: 'POST',
      body: JSON.stringify(newPublication),
      headers: {
        'Content-type': 'application/json',
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

        //Upload image
        const fileInput = document.querySelector('#fileUpload')
        if (data.status == 'Success' && fileInput.files[0]) {
          const formData = new FormData()
          formData.append('file0', fileInput.files[0])
          fetch(`${Global.url}/publication/upload/${data.publication._id}`, {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: token,
            },
          })
            .then(res => res.json())
            .then(uploadData => {
              if (uploadData.status == 'Success') {
                setSaved('Saved')
              } else {
                setSaved('Error')
              }
              if (data.status == 'Success' && uploadData.status == 'Success') {
                const myForm = document.querySelector('#publication-form')
                myForm.reset()
              }
            })
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
              <a href='#' className='following__link'>
                <span className='following__title'>Publications</span>
                <span className='following__number'>{counters.publications}</span>
              </a>
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
              <textarea name='text' className='form-post__textarea' onChange={changed} />
            </div>

            <div className='form-post__inputs'>
              <label htmlFor='file' className='form-post__label' onChange={changed}>
                Upload image
              </label>
              <input type='file' name='file0' id='fileUpload' className='form-post__image' />
            </div>

            <input type='submit' value='Send' className='form-post__btn-submit' />
          </form>
        </div>
      </div>
    </aside>
  )
}
