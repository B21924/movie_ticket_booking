import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import './BookMovie.css';

const BookMovie = () => {
  const { movieId } = useParams();  // Get movieId from URL
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);  // Initial state as null
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTiming, setSelectedTiming] = useState('');
  const [selectedTheatre, setSelectedTheatre] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const theaters = [
    { id: 't1', name: 'PVR Cinemas', location: 'Mall of India, Noida' },
    { id: 't2', name: 'INOX', location: 'Logix Mall, Noida' },
    { id: 't3', name: 'Cinepolis', location: 'GIP Mall, Noida' }
  ];

  // Fetch movie details from Firestore
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieDocRef = doc(db, 'movies', movieId);
        const movieDocSnap = await getDoc(movieDocRef);
  
        if (movieDocSnap.exists()) {
          const movieData = movieDocSnap.data();
          setMovie({
            id: movieDocSnap.id,
            name: movieData.name || '',
            description: movieData.description || '',
            price: movieData.price || 0,
            image: movieData.image || '',
            showTimings: movieData.showTimings || ['10:00 AM', '1:30 PM', '4:00 PM', '6:30 PM', '9:00 PM'],
            bookedSeats: Array.isArray(movieData.bookedSeats) ? movieData.bookedSeats : []
          });
        } else {
          console.error('No such movie!');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        navigate('/');
      }
    };
    fetchMovieDetails();
  }, [movieId, navigate]);
  

  const handleSeatSelect = (seat) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seat)
        ? prevSeats.filter((s) => s !== seat)
        : [...prevSeats, seat]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!movie.id || !userDetails.name || !userDetails.email || selectedSeats.length === 0 || !selectedTiming || !selectedTheatre) {
      alert('Please fill all details and select at least one seat, timing, and theatre.');
      return;
    }

    try {
      const movieDocRef = doc(db, 'movies', movie.id);
      
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        userDetails,
        movieId: movie.id,
        movieName: movie.name,
        seats: selectedSeats,
        timing: selectedTiming,
        theatre: selectedTheatre,
        totalPrice: selectedSeats.length * movie.price,
        bookingDate: serverTimestamp(),
      });

      await updateDoc(movieDocRef, {
        bookedSeats: [...movie.bookedSeats, ...selectedSeats]
      });

      setBookingDetails({
        userDetails,
        movieId: movie.id,
        movieName: movie.name,
        seats: selectedSeats,
        timing: selectedTiming,
        theatre: selectedTheatre,
        totalPrice: selectedSeats.length * movie.price,
        bookingId: bookingRef.id,
        bookingDate: new Date().toLocaleString()
      });
      setBookingConfirmed(true);

    } catch (error) {
      console.error('Error booking movie:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const renderSeatLayout = () => {
    const rows = 5;
    const cols = 10;
    const seatGrid = [];

    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let col = 1; col <= cols; col++) {
        const seat = `${row}-${col}`;
        const isSelected = selectedSeats.includes(seat);
        const isBooked = movie.bookedSeats.includes(seat);

        rowSeats.push(
          <button
            key={seat}
            className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
            disabled={isBooked}
            onClick={() => !isBooked && handleSeatSelect(seat)}
          >
            {seat}
          </button>
        );
      }
      seatGrid.push(
        <div key={`row-${row}`} className="seat-row">
          {rowSeats}
        </div>
      );
    }

    return seatGrid;
  };

  // Handle case where movie details are still loading
  if (!movie) return <div className="loading">Loading movie details...</div>;

  if (bookingConfirmed && bookingDetails) {
    return (
      <div className="booking-confirmation">
        <h2>🎉 Booking Confirmed!</h2>
        <div className="confirmation-details">
          <h3>Booking ID: {bookingDetails.bookingId}</h3>
          <p><strong>Movie:</strong> {bookingDetails.movieName}</p>
          <p><strong>Theatre:</strong> {bookingDetails.theatre}</p>
          <p><strong>Show Time:</strong> {bookingDetails.timing}</p>
          <p><strong>Seats:</strong> {bookingDetails.seats.join(', ')}</p>
          <p><strong>Total Price:</strong> ₹{bookingDetails.totalPrice}</p>
          <p><strong>Booked By:</strong> {bookingDetails.userDetails.name}</p>
          <p><strong>Email:</strong> {bookingDetails.userDetails.email}</p>
          <p><strong>Booking Date:</strong> {bookingDetails.bookingDate}</p>
        </div>
        <button onClick={() => navigate('/')} className="home-button">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="book-movie-container">
      <h1>Book Tickets for {movie.name}</h1>

      <div className="movie-details-section">
        <div className="movie-poster-container">
          <img src={movie.image} alt={movie.name} className="movie-poster" />
        </div>
        <div className="movie-info">
          <p><strong>Description:</strong> {movie.description}</p>
          <p><strong>Price:</strong> ₹{movie.price} per ticket</p>
          <p><strong>Available Timings:</strong> {movie.showTimings.join(', ')}</p>
        </div>
      </div>

      <div className="seat-selection-section">
        <h2>Select Seats</h2>
        <div className="screen">SCREEN THIS WAY</div>
        <div className="seat-layout-container">
          <div className="seat-layout">{renderSeatLayout()}</div>
        </div>
        <div className="seat-selection-info">
          <p>Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
          <p>Total Price: ₹{selectedSeats.length * movie.price}</p>
        </div>
      </div>

      <div className="show-details-section">
        <h2>Show Details</h2>
        <div className="form-field">
          <label>Select Theatre:</label>
          <select
            value={selectedTheatre}
            onChange={(e) => setSelectedTheatre(e.target.value)}
            required
          >
            <option value="">Choose Theatre</option>
            {theaters.map(theatre => (
              <option key={theatre.id} value={`${theatre.name}, ${theatre.location}`}>
                {theatre.name} - {theatre.location}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Select Show Timing:</label>
          <select
            value={selectedTiming}
            onChange={(e) => setSelectedTiming(e.target.value)}
            required
          >
            <option value="">Choose Timing</option>
            {movie.showTimings.map((timing, index) => (
              <option key={index} value={timing}>
                {timing}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleBooking} className="user-details-form">
        <h2>Your Details</h2>
        <div className="form-field">
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={userDetails.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="book-button">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookMovie;
