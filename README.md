# challengeMovieApp

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![React Version](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)

**challengeMovieApp** is a modern React application that lists movie data using the TMDB API, displays detailed information, and allows users to manage their favorite movies.  
With a user-friendly interface, filtering options, and favorite management, it makes exploring movies easier.

---

## Table of Contents

- [Features](#features)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Technologies](#technologies)  
- [API Key](#api-key)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- List popular movies  
- View movie details (overview, release date, etc.)  
- Filter movies by genre  
- Filter movies by year  
- Add/remove movies from favorites  
- Manage API key securely using environment variables  

---

## Installation

Clone the project to your local environment:

```bash
git clone https://github.com/ahmetfarukyasar/challengeMovieApp.git
cd challengeMovieApp
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add your TMDB API key:

```env
VITE_API_KEY=your_tmdb_api_key_here
```

Start the project:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser to view the application.

---

## Usage

- The homepage displays a list of popular movies.  
- Click on a movie card to view its detail page.  
- Use the filter section in the top right to narrow the list by genre or year.  
- Click the heart icon on a movie card to add it to your favorites. Favorites are managed using React Context.  

---

## Technologies

- React 18  
- Vite (React build tool)  
- Tailwind CSS  
- Axios (HTTP client)  
- React Router  
- React Context API  
- TMDB (The Movie Database) API  

---

## API Key

This project uses the TMDB API.  
You can get a free TMDB API key from [https://www.themoviedb.org/](https://www.themoviedb.org/).  
Add the key to your `.env` file as `VITE_API_KEY`.

---

## Contributing

If you would like to contribute to the project, please follow these steps:

1. Fork the repository and create your local copy.  
2. Create a new branch (`git checkout -b feature/feature-name`).  
3. Commit your changes (`git commit -m 'Added new feature'`).  
4. Push to the branch (`git push origin feature/feature-name`).  
5. Submit a pull request.  

Issues and suggestions are welcome.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**ahmetfarukyasar** © 2025
