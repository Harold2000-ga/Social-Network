import React from 'react'
import { Global } from '../../../helpers/Global'
import avatar from '../../../assets/img/user.png'

export const Avatar = ({ className, item }) => {
  // const { auth } = useAuth()
  return (
    <>
      {item.image != 'default_png' && (
        <img
          src={`${Global.url}/user/avatar/${item.image}`}
          className={className}
          alt='Profile picture'
        />
      )}
      {item.image == 'default_png' && (
        <img src={avatar} className={className} alt='Profile picture' />
      )}
    </>
  )
}
