import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { useParams } from 'react-router-dom'
import { GetProfile } from '../../helpers/GetProfile'
import { Avatar } from '../layout/private/Avatar'
import { Global } from '../../helpers/Global'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export const Profile = () => {
  //Hooks
  const [user, setUser] = useState({})
  const [counters, setCounters] = useState({})
  const [follow, setFollow] = useState(false)
  const { auth, counters: countUser, setCounters: setCountUser } = useAuth()
  const params = useParams()
  useEffect(() => {
    getDataUser()
    getCounters()
  }, [params.id])

  const getCounters = () => {
    fetch(`${Global.url}/user/counters/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        setCounters(data)
      })
  }
  const getDataUser = async () => {
    try {
      let dataUser = await GetProfile(params.id, setUser)
      console.log(dataUser)
      if (
        dataUser.followThisUser.following.user &&
        dataUser.followThisUser.following.user == auth._id
      )
        setFollow(true)
    } catch (error) {
      console.log(error)
    }
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
          setFollow(true)
          setCountUser({ ...countUser, following: countUser.following + 1 })
          setCounters({ ...counters, followed: counters.followed + 1 })
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
          setFollow(false)
          console.log(counters)
          setCountUser({ ...countUser, following: countUser.following - 1 })
          setCounters({ ...counters, followed: counters.followed - 1 })
        }
      })
  }
  return (
    <>
      <section className='layout__content'>
        <header className='aside__profile-info'>
          {user ? (
            <>
              <div className='profile-info__general-info'>
                <div className='general-info__container-avatar'>
                  <Avatar className='container-avatar__img' item={user} />
                </div>

                <div className='general-info__container-names'>
                  <div className='container-names__name'>
                    <h1>
                      {' '}
                      {user.name} {user.surname}{' '}
                      {user._id !== auth._id &&
                        (!follow ? (
                          <button
                            className='content__button content__button-right'
                            onClick={() => Follow(user._id)}
                          >
                            Follow
                          </button>
                        ) : (
                          <button
                            className='content__button content__button-right content__button-unfollow '
                            onClick={() => unFollow(user._id)}
                          >
                            UnFollow
                          </button>
                        ))}
                    </h1>
                  </div>
                  <h2 className='container-names__nickname'>{user.nickname}</h2>
                  <p>{user.bio}</p>
                </div>
              </div>

              <div className='profile-info__stats'>
                <div className='stats__following'>
                  <Link to={`/social/followers/${user._id}`} className='following__link'>
                    <span className='following__title'>Followers</span>
                    <span className='following__number'>{counters.followed}</span>
                  </Link>
                </div>
                <div className='stats__following'>
                  <Link to={`/social/following/${user._id}`} className='following__link'>
                    <span className='following__title'>Following</span>
                    <span className='following__number'>{counters.following}</span>
                  </Link>
                </div>

                <div className='stats__following'>
                  <a href='#' className='following__link'>
                    <span className='following__title'>Publications</span>
                    <span className='following__number'>{counters.publications}</span>
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className='loading__container'>
              <i className='layout__loading--spin fas fa-spinner fa-spin fa-2x'></i>
            </div>
          )}
        </header>

        <div className='content__posts'>
          <article className='posts__post'>
            <div className='post__container'>
              <div className='post__image-user'>
                <a href='#' className='post__image-link'>
                  <img src={avatar} className='post__user-image' alt='Foto de perfil' />
                </a>
              </div>

              <div className='post__body'>
                <div className='post__user-info'>
                  <a href='#' className='user-info__name'>
                    Victor Robles
                  </a>
                  <span className='user-info__divider'> | </span>
                  <a href='#' className='user-info__create-date'>
                    Hace 1 hora
                  </a>
                </div>

                <h4 className='post__content'>Hola, buenos dias.</h4>
              </div>
            </div>

            <div className='post__buttons'>
              <a href='#' className='post__button'>
                <i className='fa-solid fa-trash-can'></i>
              </a>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
