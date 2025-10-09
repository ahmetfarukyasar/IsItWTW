import { createContext, useContext, useState, useEffect } from "react"

const FavoriteContext = createContext()

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("movieFavorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (error) {
        console.error("Error loading favorites:", error)
      }
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("movieFavorites", JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (movie) => {
    setFavorites((prev) => {
      // Check if movie already exists
      if (prev.some((fav) => fav.id === movie.id)) {
        return prev
      }
      return [...prev, movie]
    })
  }

  const removeFromFavorites = (movieId) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId))
  }

  const isInFavorites = (movieId) => {
    return favorites.some((movie) => movie.id === movieId)
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
        clearFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoriteContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoriteProvider")
  }
  return context
}
