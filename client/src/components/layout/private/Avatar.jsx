import React from 'react'
import avatar from '../../../assets/img/user.png'

export const Avatar = ({ className, item }) => {
  // const { auth } = useAuth()
  return (
    <>
      {item.image != 'default_png' && (
        <img src={item.image} className={className} alt='Profile picture' loading='lazy' />
      )}
      {item.image == 'default_png' && (
        <img src={avatar} className={className} alt='Profile picture' />
      )}
    </>
  )
}
