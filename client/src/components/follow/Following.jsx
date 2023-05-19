import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { UserList } from '../user/UserList'
import { useParams } from 'react-router-dom'
export const Following = () => {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState([])
  const params = useParams()

  useEffect(() => {
    getUser()
  }, [])

  const getUser = (next = 1) => {
    const id = params.id

    //Get list of user
    fetch(`${Global.url}/follow/following/${id}/${next}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.users)
        if (data.users && data.status == 'Success') {
          if (list.length > 1) {
            setList([...list, ...data.users])
          } else {
            setList(data.users)
          }
          if (list.length >= data.totalUsers - data.users.length) {
            setMore(false)
          }
        }
        setFollowing(data.users_following)
        setLoading(false)
      })
  }

  return (
    <>
      <section className='layout__content'>
        <header className='content__header'>
          <h1 className='content__title'>Followings</h1>
        </header>

        <UserList
          list={list}
          setList={setList}
          more={more}
          loading={loading}
          following={following}
          setFollowing={setFollowing}
          page={page}
          setPage={setPage}
          getUser={getUser}
        />
      </section>
    </>
  )
}
