//Imports
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Global } from '../../helpers/Global'
import { PublicationList } from '../publication/PublicationList'

export const Feed = () => {
  const [publications, setPublications] = useState([])
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    getPublication(1)
  }, [params.id])

  const getPublication = (nextPage = 1, showNew = false) => {
    if (showNew) {
      setPublications([])
      setPage(1)
      nextPage = 1
    }

    //GET from the API
    fetch(`${Global.url}/publication/feed/${nextPage}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 'Success') {
          console.log(data.status)
          let newPublications = data.Publications
          if (!showNew && publications.length > 1) {
            newPublications = [...publications, ...data.Publications]
          }

          setPublications(newPublications)

          if (
            !showNew &&
            publications.length >= data.totalPublications - data.Publications.length
          ) {
            setMore(false)
          }
          setLoading(false)
        }
      })
  }

  return (
    <>
      <section className='layout__content'>
        <header className='content__header'>
          <h1 className='content__title'>Timeline</h1>
          <button className='content__button' onClick={() => getPublication(1, true)}>
            Mostrar nuevas
          </button>
        </header>

        <PublicationList
          publications={publications}
          setPublications={setPublications}
          page={page}
          setPage={setPage}
          more={more}
          loading={loading}
          getPublication={getPublication}
        />
      </section>
    </>
  )
}
