import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'
import { NavLink, Navigate } from 'react-router-dom'

export const Register = () => {
  const { form, changed } = useForm()
  const [saved, setSaved] = useState('not set')
  const [redirect, setRedirect] = useState(false)

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
        if (data.status === 'Success') {
          setSaved('User register')
          setTimeout(() => {
            setRedirect(true)
          }, 1000)
        }
        if (data.message === 'Not enough data') setSaved('Not enough data')
        if (data.message === 'User already exist') setSaved('User already exist')
      })
  }

  if (redirect) {
    return <Navigate to='/login' />
  }

  return (
    <>
      <header className='content__header content__header--public'>
        <h1 className='content__title'>Register</h1>
      </header>

      <div className='content__posts'>
        {saved === 'User register' ? <strong className='alert alert_success'>{saved}</strong> : ''}
        {saved === 'User already exist' ? (
          <strong className='alert alert_error'>{saved}</strong>
        ) : (
          ''
        )}
        {saved === 'Not enough data' ? <strong className='alert alert_error'>{saved}</strong> : ''}
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
          <p className='text-login'>
            <NavLink to='/login'>Log-in</NavLink> if you already have a account.
          </p>

          <input type='submit' value='Register' className='btn btn-success' />
        </form>
      </div>
    </>
  )
}
