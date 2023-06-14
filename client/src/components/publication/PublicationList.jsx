/* eslint-disable react/prop-types */
import React from 'react'
import { Avatar } from '../layout/private/Avatar'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'

export const PublicationList = ({
  publications,
  setPublications,
  loading,
  more,
  page,
  setPage,
  getPublication,
}) => {
  const { auth, counters, setCounters } = useAuth()

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

  return (
    <>
      <div className='content__posts'>
        {publications?.map(item => {
          return (
            <article key={item._id} className='posts__post'>
              <div className='post__container'>
                <div className='post__image-user'>
                  <Link to={'/social/profile/' + item.user._id} className='post__image-link'>
                    <Avatar className='post__user-image' item={item.user} />
                  </Link>
                </div>

                <div className='post__body'>
                  <div className='post__user-info'>
                    <Link to={'/social/profile/' + item.user._id} className='user-info__name'>
                      {item.user.name}
                    </Link>
                    <span className='user-info__divider'> | </span>
                    <a href='#' className='user-info__create-date'>
                      <ReactTimeAgo date={item.create_at} locale='en-US' />
                    </a>
                  </div>

                  <h4 className='post__content'>{item.text}</h4>
                  {item.file && (
                    <div className='post__image-publication'>
                      <img src={`${Global.url}/publication/media/${item.file}`} />
                    </div>
                  )}
                </div>
              </div>
              {item.user._id === auth._id && (
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
    </>
  )
}
