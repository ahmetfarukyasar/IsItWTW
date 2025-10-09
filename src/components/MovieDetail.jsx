import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoriteContext'
import axios from 'axios';
import { FaArrowLeft, FaHeart, FaPeopleGroup, FaStar } from 'react-icons/fa6';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { favorites, addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
    
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const API_KEY = import.meta.env.VITE_API_KEY;
    
    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`)
            .then(res => {
                setMovie(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-white text-center mt-16">Yükleniyor...</div>;
    if (!movie) return <div className="text-white text-center mt-16">Film bulunamadı</div>;

    const isFavorite = isInFavorites(movie.id);

    const handleFavoriteClick = () => {
        const movieData = {
            id: movie.id,
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            release_date: movie.release_date
        };

        if (isFavorite) {
            removeFromFavorites(movie.id);
        } else {
            addToFavorites(movieData);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <button 
                onClick={() => navigate(-1)}
                className="mb-6 px-6 py-3 bg-blue-600 rounded-full hover:bg-blue-700 cursor-pointer"
            >
                <FaArrowLeft size={20}/>
            </button>

            <div className="flex gap-8 max-w-6xl mx-auto">
                <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-80 h-auto rounded-lg"
                />
                
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        <h1 className="text-4xl font-bold">{movie.title}</h1>
                        <button
                            onClick={handleFavoriteClick}
                            className={`px-4 py-4 rounded-full transition cursor-pointer ${
                                isFavorite 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                        >
                            <FaHeart size={20}/>
                        </button>
                    </div>
                    
                    <p className="text-xl text-gray-300 mb-4">
                        {movie.release_date?.slice(0, 4)} • {movie.runtime} minutes
                    </p>
                    
                    <p className="text-lg mb-6 leading-relaxed">
                        {movie.overview}
                    </p>
                    
                    <div className="flex gap-4 mb-6">
                        <span className="bg-yellow-600 px-3 py-1 rounded flex items-center justify-center gap-2">
                            <FaStar /> {movie.vote_average?.toFixed(1)}
                        </span>
                        <span className="bg-blue-600 px-3 py-1 rounded flex items-center justify-center gap-2">
                            <FaPeopleGroup /> {movie.vote_count} vote
                        </span>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Genres:</h3>
                        <div className="flex gap-2">
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className="bg-purple-600 px-3 py-1 rounded">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;