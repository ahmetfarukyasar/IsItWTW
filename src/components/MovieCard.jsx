"use client"
import { FaHeart } from "react-icons/fa6"
import { useFavorites } from "../contexts/FavoriteContext"
import { useNavigate } from "react-router-dom"

const MovieCard = ({ id, title, poster, release_date }) => {
  const { favorites, addToFavorites, removeFromFavorites, isInFavorites } = useFavorites()
  const isFavorite = isInFavorites(id)

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    const movie = { id, title, poster, release_date }

    if (isFavorite) {
      removeFromFavorites(id)
    } else {
      addToFavorites(movie)
    }
  }

  const navigate = useNavigate()

  const handleDetails = (id) => {
    navigate(`/movie/${id}`)
  }

  return (
    <div
      onClick={() => {
        handleDetails(id)
      }}
      className="cursor-pointer hover:z-1000 w-full"
    >
      <div className="movie-card flex flex-col h-fit w-full max-w-[200px] bg-gray-800 rounded-lg overflow-hidden hover:scale-105 sm:hover:scale-110 transition-transform duration-300">
        <div className="relative">
          {poster ? (
            <img src={poster || "/placeholder.svg"} alt={title} className="w-full h-64 sm:h-72 lg:h-80 object-cover" />
          ) : (
            <div className="w-full h-64 sm:h-72 lg:h-80 bg-gray-700 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <button
            type="button"
            className={`absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1
                            ${isFavorite ? "hover:bg-white bg-white" : "hover:bg-red-600"}
                            transition cursor-pointer`}
            onClick={handleFavoriteClick}
          >
            <FaHeart color={isFavorite ? "red" : "white"} />
          </button>
        </div>

        <div className="basic-info glass flex flex-col h-28 sm:h-32 items-center justify-end p-3 sm:p-4 text-white font-mono">
          <h2 className="font-semibold text-sm sm:text-base text-center line-clamp-2">{title}</h2>
          <span className="flex text-xs sm:text-sm text-[var(--text-secondary)] mt-1">{release_date?.slice(0, 4)}</span>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
