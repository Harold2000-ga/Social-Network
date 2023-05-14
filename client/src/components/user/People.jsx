import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { Avatar } from '../layout/private/Avatar'

export const People = () => {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    getUser()
  }, [page])

  const getUser = () => {
    //Get list of user
    fetch(`${Global.url}/user/list/${page}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.users && data.status == 'Success') setList(data.users)
      })
  }

  const nextPage = () => {
    let next = page + 1
    console.log(list)
    setPage(next)
  }
  console.log(list)
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
                  <a href='#' className='post__button post__button--green'>
                    Follow
                  </a>
                  {/*   <a href='#' className='post__button'>
                UnFollow
              </a> */}
                </div>
              </article>
            )
          })}
        </div>

        <div className='content__container-btn'>
          <button className='content__btn-more-post' onClick={nextPage}>
            Show more users
          </button>
        </div>
      </section>
    </>
  )
}
