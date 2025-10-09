import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;

function SearchFilter({ 
  searchTerm, onSearchTermChange, 
  selectedGenre, onGenreChange, 
  selectedYear, onYearChange 
}) {
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`)
      .then(res => setGenres(res.data.genres))
      .catch(console.error);

    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let y = currentYear; y >= 1950; y--) {
      yearArray.push(y);
    }
    setYears(yearArray);
  }, []);

  return (
    <div className='w-full flex flex-row items-center px-8 gap-4 mt-4 py-4'>
      <input
        type="text"
        className='bg-gray-800 text-white p-4 rounded-xl flex-grow'
        placeholder="Search movies..."
        value={searchTerm}
        onChange={e => onSearchTermChange(e.target.value)}
      />
      <select
        name="genres"
        id="genres"
        className="p-4 rounded-xl text-white bg-gray-800"
        value={selectedGenre}
        onChange={e => onGenreChange(e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map(genre => (
          <option key={genre.id} value={genre.id}>{genre.name}</option>
        ))}
      </select>
      <select
        name="years"
        id="years"
        className="p-4 rounded-xl text-white bg-gray-800"
        value={selectedYear}
        onChange={e => onYearChange(e.target.value)}
      >
        <option value="">All Years</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
}

export default SearchFilter;
