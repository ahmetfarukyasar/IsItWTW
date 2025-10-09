import { useFavorites } from "../contexts/FavoriteContext"
import MovieCard from "../components/MovieCard"

const Favorites = () => {
  const { favorites, clearFavorites } = useFavorites()

  try {
    if (favorites.length === 0) {
      return (
        <div className="text-center mt-12 sm:mt-16 px-4">
          <h2 className="text-xl sm:text-2xl text-black font-mono mb-4">You do not have favorite movie yet.</h2>
          <p className="text-sm sm:text-base text-gray-400 font-mono">
            You can add your favorites from{" "}
            <a href="/explore" className="font-semibold text-black">
              explore
            </a>{" "}
            page.
          </p>
        </div>
      )
    }

    const handleClearAll = () => {
      if (window.confirm("Are you sure that you want to remove all your favorites?")) {
        clearFavorites()
      }
    }

    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 sm:mt-8 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl text-white">My Favorites ({favorites.length})</h1>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition w-full sm:w-auto"
          >
            Remove All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 items-top justify-items-center">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={movie.poster}
              release_date={movie.release_date}
            />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Favorites page error:", error)
    return <div className="text-center mt-16 text-xl sm:text-2xl text-white px-4">Page Error!</div>
  }
}

export default Favorites
