import React from 'react'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helpers/Global'
import avatar from '../../../assets/img/user.png'

export const Avatar = ({ className }) => {
  const { auth } = useAuth()
  return (
    <>
      {auth.image != 'default_png' && (
        <img
          src={`${Global.url}/user/avatar/${auth.image}`}
          className={className}
          alt='Profile picture'
        />
      )}
      {auth.image == 'default_png' && (
        <img src={avatar} className={className} alt='Profile picture' />
      )}
    </>
  )
}
