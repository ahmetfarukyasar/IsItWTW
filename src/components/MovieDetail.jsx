import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useFavorites } from "../contexts/FavoriteContext"
import axios from "axios"
import { FaArrowLeft, FaHeart, FaPeopleGroup, FaStar } from "react-icons/fa6"
import RatingStar from "./RatingStar"
import CommentsSection from "./CommentsSection"
import useAuth from "../hooks/useAuth"
import { useAverageRating } from "../hooks/useAverageRating"

const MovieDetail = () => {
  const user = useAuth();
  const { id } = useParams()
  const navigate = useNavigate()
  const { favorites, addToFavorites, removeFromFavorites, isInFavorites } = useFavorites()
  const { averageRating, totalVotes } = useAverageRating(id)
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_KEY = import.meta.env.VITE_API_KEY

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then((res) => {
        setMovie(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="text-white text-center mt-16 px-4">Loading...</div>
  if (!movie) return <div className="text-white text-center mt-16 px-4">Movie not found</div>

  const isFavorite = isInFavorites(movie.id)

  const handleFavoriteClick = () => {
    const movieData = {
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      release_date: movie.release_date,
    }

    if (isFavorite) {
      removeFromFavorites(movie.id)
    } else {
      addToFavorites(movieData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 rounded-full hover:bg-blue-700 cursor-pointer"
      >
        <FaArrowLeft size={20} />
      </button>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 max-w-6xl mx-auto">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full lg:w-80 h-auto rounded-lg"
        />

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold">{movie.title}</h1>
            <button
              onClick={handleFavoriteClick}
              className={`px-4 py-4 rounded-full transition cursor-pointer ${isFavorite ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
                }`}
            >
              <FaHeart size={20} />
            </button>
          </div>

          <p className="text-lg sm:text-xl text-gray-300 mb-4">
            {movie.release_date?.slice(0, 4)} • {movie.runtime} minutes
          </p>

          <p className="text-base sm:text-lg mb-6 leading-relaxed">{movie.overview}</p>

          <h3 className="text-lg sm:text-xl font-semibold mb-2">TMDB:</h3>
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
            <span className="bg-yellow-600 px-3 py-1 rounded flex items-center justify-center gap-2 text-sm sm:text-base">
              <FaStar /> {movie.vote_average?.toFixed(1)}
            </span>
            <span className="bg-blue-600 px-3 py-1 rounded flex items-center justify-center gap-2 text-sm sm:text-base">
              <FaPeopleGroup /> {movie.vote_count} vote
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Community:</h3>
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
            {averageRating !== null && (
              <span className="bg-green-600 px-3 py-1 rounded flex items-center justify-center gap-2 text-sm sm:text-base">
                <FaStar /> {averageRating.toFixed(1)} ({totalVotes} user{totalVotes !== 1 ? 's' : ''})
              </span>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Genres:</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="bg-purple-600 px-3 py-1 rounded text-sm sm:text-base">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Your Rating:</h3>
            {
              user
                ?
                <div><RatingStar movieId={id} user={user} /></div>
                :
                <p>You must <Link to="/signin" className="underline">log in</Link> to rate movies.</p>
            }
          </div>
        </div>
      </div>

      <CommentsSection movieId={id} user={user} />

    </div>
  )
}

export default MovieDetail
