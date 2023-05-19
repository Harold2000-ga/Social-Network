/* eslint-disable react/prop-types */
import React from 'react'
import { Avatar } from '../layout/private/Avatar'
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'

export const UserList = ({
  more,
  loading,
  list,
  following,
  setFollowing,
  page,
  setPage,
  getUser,
}) => {
  const { auth, counters, setCounters } = useAuth()

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
          setCounters({ ...counters, following: counters.following + 1 })
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
        if (data.status == 'success') {
          let newFollowings = following.filter(item => id !== item)
          setCounters({ ...counters, following: counters.following - 1 })
          setFollowing(newFollowings)
        }
      })
  }

  return (
    <>
      <div className='content__posts'>
        {list?.map(item => {
          return (
            item._id !== auth._id && (
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
                  {!following.includes(item._id) && (
                    <button
                      className='post__button post__button--green'
                      onClick={() => Follow(item._id)}
                    >
                      Follow
                    </button>
                  )}
                  {following.includes(item._id) && (
                    <button className='post__button' onClick={() => unFollow(item._id)}>
                      UnFollow
                    </button>
                  )}
                </div>
              </article>
            )
          )
        })}
      </div>
      {loading ? (
        <div className='loading__container'>
          <i className='layout__loading--spin fas fa-spinner fa-spin fa-2x'></i>
        </div>
      ) : (
        ''
      )}

      {more && (
        <div className='content__container-btn'>
          <button className='content__btn-more-post' onClick={nextPage}>
            Show more users
          </button>
        </div>
      )}
    </>
  )
}
