import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import RootLayout from './layouts/RootLayout'
import Explore from './pages/Explore'
import Favorites from './pages/Favorites'
import About from './pages/About'
import { FavoriteProvider } from './contexts/FavoriteContext'
import MovieDetail from './components/MovieDetail'

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route index element={<Home />}/>
      <Route path='explore' element={<Explore />}/>
      <Route path='favorites' element={<Favorites />}/>
      <Route path='about' element={<About />}/>
      <Route path='movie/:id' element={<MovieDetail />}/>
    </Route>
  )
)

const App = () => {
  return (
    <FavoriteProvider>
      <RouterProvider router={route}/>
    </FavoriteProvider>
  )
}

export default App