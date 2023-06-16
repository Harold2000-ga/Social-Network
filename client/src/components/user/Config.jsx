import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { Avatar } from '../layout/private/Avatar'
import { SerializeForm } from '../../helpers/SerializeForm'
import { Global } from '../../helpers/Global'

export const Config = () => {
  const [saved, setSaved] = useState('not saved')
  const { auth, setAuth } = useAuth()
  const token = localStorage.getItem('token')

  //Update
  const updateUser = e => {
    e.preventDefault()
    //Get data from Form
    const formData = new FormData()
    formData.append('name', e.target.name.value)
    formData.append('surname', e.target.surname.value)
    formData.append('nickname', e.target.nickname.value)
    formData.append('email', e.target.email.value)
    formData.append('bio', e.target.bio.value)
    formData.append('password', e.target.password.value)

    const fileInput = document.querySelector('#file')
    formData.append('image', fileInput.files[0])
    //Update in data Base
    fetch(`${Global.url}/user/update`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 'Success' && data.user) {
          delete data.user.password

          setAuth(data.user)
          setSaved('Saved')
        } else {
          setSaved('Error')
        }
      })
  }

  return (
    <>
      <header className='content__header content__header--public'>
        <h1 className='content__title'>Settings</h1>
      </header>
      <div className='content__posts'>
        {saved == 'Saved' ? (
          <strong className='alert alert_success'>User has been updated</strong>
        ) : (
          ''
        )}
        {saved == 'Error' ? <strong className='alert alert_error'>{saved}</strong> : ''}
        <form className='register-form' onSubmit={updateUser}>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input defaultValue={auth.name} type='text' name='name' />
          </div>
          <div className='form-group'>
            <label htmlFor='surname'>Surname</label>
            <input defaultValue={auth.surname} type='text' name='surname' />
          </div>
          <div className='form-group'>
            <label htmlFor='nickname'>Nickname</label>
            <input defaultValue={auth.nickname} type='text' name='nickname' />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input defaultValue={auth.email} type='email' name='email' />
          </div>
          <div className='form-group'>
            <label htmlFor='bio'>Biography</label>
            <textarea defaultValue={auth.bio} name='bio' />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input defaultValue='' type='password' name='password' />
          </div>
          <div className='form-group'>
            <label htmlFor='file0'>Avatar</label>
            <div className='general-info__container-avatar'>
              <Avatar className='container-avatar__img' item={auth} />
            </div>
            <br />
            <input type='file' name='image' id='file' />
          </div>
          <br />
          <input type='submit' value='Update' className='btn btn-success' />
        </form>
      </div>{' '}
    </>
  )
}
