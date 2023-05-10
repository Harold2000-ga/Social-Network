import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'

export const Register = () => {
  const { form, changed } = useForm()
  const [saved, setSaved] = useState('not set')

  const saveUser = e => {
    e.preventDefault()
    const newUser = form
    fetch(`${Global.url}/user/register`, {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 'Success') setSaved('User register')
        if (data.status == 'Error') setSaved('Error')
        console.log(data)
      })
  }

  return (
    <>
      <header className='content__header content__header--public'>
        <h1 className='content__title'>Register</h1>
      </header>
      <strong>{saved == 'User register' ? saved : ''}</strong>
      <strong>{saved == 'Error' ? saved : ''}</strong>
      <div className='content__posts'>
        <form className='register-form' onSubmit={saveUser}>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input onChange={changed} type='text' name='name' />
          </div>
          <div className='form-group'>
            <label htmlFor='surname'>Surname</label>
            <input onChange={changed} type='text' name='surname' />
          </div>
          <div className='form-group'>
            <label htmlFor='nickname'>Nickname</label>
            <input onChange={changed} type='text' name='nickname' />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input onChange={changed} type='email' name='email' />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input onChange={changed} type='password' name='password' />
          </div>
          <input type='submit' value='Register' className='btn btn-success' />
        </form>
      </div>
    </>
  )
}
