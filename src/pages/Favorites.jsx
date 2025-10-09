import React from 'react'
import { useFavorites } from '../contexts/FavoriteContext'
import MovieCard from '../components/MovieCard'

const Favorites = () => {
    try {
        const { favorites, clearFavorites } = useFavorites();

        if (favorites.length === 0) {
            return (
                <div className='text-center mt-16'>
                    <h2 className='text-2xl text-black font-mono mb-4'>You do not have favorite movie yet.</h2>
                    <p className='text-gray-400 font-mono'>You can add your favorites from <a href="/explore" className='font-semibold text-black'>explore</a> page.</p>
                </div>
            );
        }

        const handleClearAll = () => {
            if (window.confirm('Are you sure that you want to remove all your favorites?')) {
                clearFavorites();
            }
        };

        return (
            <div>
                <div className='flex justify-between items-center mt-8 mb-8 px-4'>
                    <h1 className='text-3xl text-white'>
                        My Favorites ({favorites.length})
                    </h1>
                    <button 
                        onClick={handleClearAll}
                        className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'
                    >
                        Remove All
                    </button>
                </div>
                
                <div className='grid grid-cols-6 gap-4 mt-8 items-top justify-items-center'>
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
        );
    } catch (error) {
        console.error('Favorites page error:', error);
        return (
            <div className='text-center mt-16 text-2xl text-white'>
                Page Error!
            </div>
        );
    }
}

export default Favorites  