import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export const Logout = () => {
  const navigate = useNavigate()
  const { setAuth, setCounters } = useAuth()
  useEffect(() => {
    //Clean Local Storage
    localStorage.clear()
    //Clean context
    setAuth({})
    setCounters({})
    //Redirection
    navigate('/login')
  })

  return (
    <div>
      <h1>Closing session....</h1>
    </div>
  )
}
