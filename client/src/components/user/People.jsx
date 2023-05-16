import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { Avatar } from '../layout/private/Avatar'

export const People = () => {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState([])

  useEffect(() => {
    getUser()
  }, [])

  const getUser = (next = 1) => {
    //Get list of user
    fetch(`${Global.url}/user/list/${next}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.users && data.status == 'Success') {
          console.log(data)
          if (list.length > 1) {
            setList([...list, ...data.users])
          } else {
            setList(data.users)
          }
          if (list.length >= data.totalUsers - data.users.length) {
            setMore(false)
          }
        }
        setLoading(false)
      })
  }

  const nextPage = () => {
    let next = page + 1
    setPage(next)
    getUser(next)
  }
  const Follow = id => {
    fetch(`${Global.url}/follow/save`, {
      method: 'POST',
      body: JSON.stringify({ followed: id }),
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 'Success') {
          setFollowing([...following, id])
        }
      })
  }
  const unFollow = id => {
    fetch(`${Global.url}/follow/unfollow/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 'Success') {
          let newFollowings = following.filter(item => item._id != id)
          setFollowing(newFollowings)
        }
      })
  }

  return (
    <>
      <section className='layout__content'>
        <header className='content__header'>
          <h1 className='content__title'>People</h1>
        </header>

        <div className='content__posts'>
          {list?.map(item => {
            return (
              <article className='posts__post' key={item._id}>
                <div className='post__container'>
                  <div className='post__image-user'>
                    <a href='#' className='post__image-link'>
                      <Avatar className='post__user-image' item={item} />
                    </a>
                  </div>

                  <div className='post__body'>
                    <div className='post__user-info'>
                      <a href='#' className='user-info__name'>
                        {item.name} {item.surname}
                      </a>
                      <span className='user-info__divider'> | </span>
                      <a href='#' className='user-info__create-date'>
                        {item.date}
                      </a>
                    </div>

                    <h4 className='post__content'>{item.bio}</h4>
                  </div>
                </div>

                <div className='post__buttons'>
                  <button
                    className='post__button post__button--green'
                    onClick={() => Follow(item._id)}
                  >
                    Follow
                  </button>

                  <button className='post__button' onClick={() => unFollow(item._id)}>
                    UnFollow
                  </button>
                </div>
              </article>
            )
          })}
        </div>
        {loading ? <h1 className='people_loading'>Loading.....</h1> : ''}
        {more && (
          <div className='content__container-btn'>
            <button className='content__btn-more-post' onClick={nextPage}>
              Show more users
            </button>
          </div>
        )}
      </section>
    </>
  )
}
