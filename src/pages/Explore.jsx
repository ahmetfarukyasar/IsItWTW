import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import SearchFilter from '../components/SearchFilter';

const API_KEY = import.meta.env.VITE_API_KEY;

const Explore = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [searchTerm, selectedGenre, selectedYear]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = '';
        if (searchTerm.trim()) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=${page}&query=${encodeURIComponent(searchTerm)}`;
        } else {
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;
          if (selectedGenre) url += `&with_genres=${selectedGenre}`;
          if (selectedYear) url += `&primary_release_year=${selectedYear}`;
        }

        const res = await axios.get(url);
        if (page === 1) setMovies(res.data.results);
        else setMovies(prev => [...prev, ...res.data.results]);
        setTotalPages(res.data.total_pages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm, selectedGenre, selectedYear, page]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="px-8">
      <SearchFilter
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      {loading && <div className="text-center mt-8 text-white text-2xl">Loading...</div>}

      {!loading && movies.length === 0 && (
        <div className="text-center mt-8 text-white text-xl">No movies found.</div>
      )}

      <div className="grid grid-cols-6 gap-4 mt-8 justify-items-center">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            release_date={movie.release_date}
          />
        ))}
      </div>

      {page < totalPages && !loading && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            className="px-4 py-2 outline-2 rounded cursor-pointer hover:bg-gray-600 hover:text-white"
            onClick={handleLoadMore}
          >
            More
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
