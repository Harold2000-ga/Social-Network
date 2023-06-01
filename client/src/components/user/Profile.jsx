//Imports
import React, { useEffect, useState } from 'react'
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
  const [publications, setPublications] = useState([])
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [follow, setFollow] = useState(false)
  const { auth, counters: countUser, setCounters: setCountUser } = useAuth()
  const params = useParams()

  useEffect(() => {
    getDataUser()
    getPublication()
    getCounters()
  }, [params.id])

  // Counter for the profile
  const getCounters = () => {
    //Get data from the API
    fetch(`${Global.url}/user/counters/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        //Update State
        setCounters(data)
      })
  }
  //Data user and validate Follow
  const getDataUser = async () => {
    try {
      //Get data from the API using helper GetProfile
      let dataUser = await GetProfile(params.id, setUser)
      //Validate if I follow
      if (dataUser.followThisUser.following?.user == auth._id)
        //Update State
        setFollow(true)
    } catch (error) {
      console.log(error)
    }
  }
  //Follow and Unfollow buttons
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
  //Publication from User
  const getPublication = (nextPage = 1) => {
    //GET from the API
    fetch(`${Global.url}/publication/user/${params.id}/${nextPage}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 'Success') {
          if (publications.length > 1) {
            console.log(data.Publications)
            setPublications([...publications, ...data.Publications])
          } else setPublications(data.Publications)
          if (publications.length >= data.totalPublications - data.Publications.length) {
            setMore(false)
          }
          setLoading(false)
        }
      })
  }
  //Logic pagination
  const nextPage = () => {
    const next = page + 1
    setPage(next)
    getPublication(next)
  }
  //Delete Publication from Database and Layout
  const deletePublication = id => {
    //Delete from the Database
    fetch(`${Global.url}/publication/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 'Success') {
          const filterPublications = publications.filter(item => item._id !== id)
          setPublications(filterPublications)
          setCounters({ ...counters, publications: counters.publications - 1 })
        }
      })
  }

  //Render
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
          {publications?.map(item => {
            return (
              <article key={item._id} className='posts__post'>
                <div className='post__container'>
                  <div className='post__image-user'>
                    <a href='#' className='post__image-link'>
                      <Avatar className='post__user-image' item={user} />
                    </a>
                  </div>

                  <div className='post__body'>
                    <div className='post__user-info'>
                      <a href='#' className='user-info__name'>
                        Robles
                      </a>
                      <span className='user-info__divider'> | </span>
                      <a href='#' className='user-info__create-date'>
                        Hace 1 hora
                      </a>
                    </div>

                    <h4 className='post__content'>{item.text}</h4>
                  </div>
                </div>
                {user._id === auth._id && (
                  <div className='post__buttons'>
                    <button onClick={() => deletePublication(item._id)} className='post__button'>
                      <i className='fa-solid fa-trash-can'></i>
                    </button>
                  </div>
                )}
              </article>
            )
          })}
          {loading ? (
            <div className='loading__container'>
              <i className='layout__loading--spin fas fa-spinner fa-spin fa-2x'></i>
            </div>
          ) : (
            ''
          )}
        </div>
        {more && (
          <div className='content__container-btn'>
            <button className='content__btn-more-post' onClick={nextPage}>
              More publications
            </button>
          </div>
        )}
      </section>
    </>
  )
}
