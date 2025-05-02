import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'movies'));
        const moviesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || '',
          description: doc.data().description || '',
          price: doc.data().price || 0,
          image: doc.data().image || '',
          showTimings: Array.isArray(doc.data().showTimings) ? doc.data().showTimings : [],
          bookedSeats: Array.isArray(doc.data().bookedSeats) ? doc.data().bookedSeats : []
        }));
        setMovies(moviesList);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-logo">MovieHub</div>
        <ul className="navbar-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/add-movie" className="nav-link">Add Movie</Link></li>
        </ul>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🎬 Welcome to MovieHub</h1>
          <p className="hero-description">Discover the latest movies and book tickets online</p>
          <Link to="/add-movie" className="hero-button">Add a Movie</Link>
        </div>
      </section>

      <h1 className="home-title">🎬 Now Showing</h1>

      <div className="movies-grid">
        {loading ? (
          <div className="loading-message">Loading movies...</div>
        ) : movies.length === 0 ? (
          <div className="no-movies">No movies available</div>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={movie.image}
                alt={movie.name}
                className="movie-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                }}
              />
              <div className="movie-details">
                <h2 className="movie-name">{movie.name}</h2>
                <p className="movie-description">
                  {movie.description.length > 100
                    ? `${movie.description.substring(0, 100)}...`
                    : movie.description}
                </p>
                <p className="movie-price">₹{movie.price}</p>
                {movie.showTimings.length > 0 && (
                  <p className="show-timings">
                    {movie.showTimings.slice(0, 2).join(', ')}
                    {movie.showTimings.length > 2 ? '...' : ''}
                  </p>
                )}
                <p className="seat-availability">
                  {movie.bookedSeats.length} / {50} seats booked
                </p>
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