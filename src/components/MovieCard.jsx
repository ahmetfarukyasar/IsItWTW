import React from 'react'
import { FaHeart } from 'react-icons/fa6';
import { useFavorites } from '../contexts/FavoriteContext';
import MovieDetail from './MovieDetail';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ id, title, poster, release_date }) => {
    // Önce context olmadan test et
    let favorites, addToFavorites, removeFromFavorites, isInFavorites;
    
    try {
        const context = useFavorites();
        favorites = context.favorites;
        addToFavorites = context.addToFavorites;
        removeFromFavorites = context.removeFromFavorites;
        isInFavorites = context.isInFavorites;
    } catch (error) {
        console.log('Context bulunamadı, varsayılan değerler kullanılıyor');
        favorites = [];
        addToFavorites = () => {};
        removeFromFavorites = () => {};
        isInFavorites = () => false;
    }

    const isFavorite = isInFavorites(id);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        const movie = { id, title, poster, release_date };
        
        if (isFavorite) {
            removeFromFavorites(id);
        } else {
            addToFavorites(movie);
        }
    };

    const navigate = useNavigate();

    const handleDetails = (id) => {
        navigate(`/movie/${id}`);
        console.log("Navigating to movie: ", {id});
    }

    return (
        <button onClick={() => { handleDetails(id) }} className='cursor-pointer hover:z-1000'>
            <div className='movie-card flex flex-col h-fit w-48 bg-gray-800 rounded-lg overflow-hidden hover:scale-110 transition-transform duration-300'>
                <div className='relative'>
                    <img src={poster} alt={title} className='w-full h-80 object-cover' />
                    <button
                        type="button"
                        className={`absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1
                            ${isFavorite ? 'hover:bg-white bg-white' : 'hover:bg-red-600'}
                            transition cursor-pointer`}
                        onClick={handleFavoriteClick}
                    >
                        <FaHeart color={isFavorite ? 'red' : 'white'} />
                    </button>
                </div>

                <div className="basic-info glass flex flex-col h-32 items-center justify-end p-4 text-white font-mono">
                    <h2 className='font-semibold'>{title}</h2>
                    <span className='flex text-[var(--text-secondary)]'>{release_date?.slice(0, 4)}</span>
                </div>
            </div>
        </button>
    )
}

export default MovieCard;