import React, { createContext, useEffect, useState } from 'react'
import { Global } from '../helpers/Global'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})
  const [counters, setCounters] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authUser()
  }, [])

  const authUser = () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (!token || !user) {
      setLoading(false)
      return false
    }

    const userObj = JSON.parse(user)
    const userId = userObj.id
    //User
    fetch(`${Global.url}/user/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => setAuth(data.user))
    //Counters
    fetch(`${Global.url}/user/counters/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => setCounters(data))
      .then(() => setLoading(false))
  }

  return (
    <AuthContext.Provider
      value={{ auth, counters, loading, setAuth, setCounters }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export default AuthContext
