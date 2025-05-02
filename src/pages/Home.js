import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Home.css'; // Import Home page styles

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'movies'));
        const moviesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovies(moviesList);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="home-container">
      {/* Nav Bar */}
      <nav className="navbar">
        <div className="navbar-logo">MovieHub</div>
        <ul className="navbar-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/add-movie" className="nav-link">Add Movie</Link></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🎬 Welcome to MovieHub</h1>
          <p className="hero-description">Discover the latest movies and book tickets online</p>
          <Link to="/add-movie" className="hero-button">Add a Movie</Link>
        </div>
      </section>

      {/* Home Page Title */}
      <h1 className="home-title">🎬 Now Showing</h1>

      {/* Movie Grid */}
      <div className="movies-grid">
        {movies.length === 0 ? (
          <div className="loading-message">Loading movies...</div>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              {/* Display movie image */}
              {movie.image && (
                <img
                  src={movie.image}
                  alt={movie.name}
                  className="movie-image"
                />
              )}
              <div className="movie-details">
                <h2 className="movie-name">{movie.name}</h2>
                <p className="movie-description">{movie.description}</p>
                <p className="movie-price">Price: ₹{movie.price}</p>
                <Link to={`/book/${movie.id}`} className="book-button">
                  Book Now
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
