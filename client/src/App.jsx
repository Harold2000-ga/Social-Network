import React from 'react'
import { Header } from './components/layout/private/Header'

function App() {
  return (
    <div className='layout'>
      <h1>Proyecto red social</h1>
      <Header />
      <section className='layout__content'></section>
    </div>
  )
}

export default App
