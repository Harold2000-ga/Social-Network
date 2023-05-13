import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'

export const Login = () => {
  const { form, changed } = useForm()
  const [login, setLogin] = useState()
  const { setAuth } = useAuth()

  const loginUser = e => {
    e.preventDefault()
    const userLogin = form
    fetch(`${Global.url}/user/login`, {
      method: 'POST',
      body: JSON.stringify(userLogin),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 'Success') {
          //Save in storage
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          //Message
          setLogin('User Login')
          //Set context
          setAuth(data.user)
          //Redirection
          setTimeout(() => {
            window.location.reload()
          }, 800)
        }
        if (data.status == 'Error') setLogin('Error')
      })
  }

  return (
    <>
      <header className='content__header content__header--public'>
        <h1 className='content__title'>Login</h1>
      </header>
      {login == 'User Login' ? (
        <strong className='alert alert_success'>{login}</strong>
      ) : (
        ''
      )}
      {login == 'Error' ? (
        <strong className='alert alert_error'>{login}</strong>
      ) : (
        ''
      )}

      <div className='content__posts'>
        <form className='form-login' onSubmit={loginUser}>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input onChange={changed} type='text' name='email' />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input onChange={changed} type='password' name='password' />
          </div>
          <input type='submit' value='Log-In' className='btn btn-success' />
        </form>
      </div>
    </>
  )
}
