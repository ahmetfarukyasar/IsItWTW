import React, { useEffect, useState } from 'react'
import axios from 'axios'
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
      .then(res => setPopular(res.data.results.slice(0, 6)))
      .catch(err => console.log(err));

    axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`)
      .then(res => setUpcoming(res.data.results.slice(0, 6)))
      .catch(err => console.log(err));
  }, []);



  return (
    <div className="text-white">
      <div className="relative h-[70vh] flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <div className="relative text-center z-10">
          <h1 className="text-5xl font-bold mb-4">Welcome to MovieApp</h1>
          <p className="text-lg mb-8">Discover the latest and greatest in cinema</p>
          <Link to='/explore' className="px-6 py-3 bg-red-600 text-center hover:bg-red-700 rounded-lg font-semibold cursor-pointer">
            Explore Now
          </Link>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-3xl text-black font-semibold mb-6">Popular Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {popular.map(movie => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              release_date={movie.release_date}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-12 mb-16">
        <h2 className="text-3xl text-black font-semibold mb-6">Coming Soon</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {upcoming.map(movie => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              release_date={movie.release_date}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
