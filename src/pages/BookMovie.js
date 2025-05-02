import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import './BookMovie.css';

const BookMovie = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [userName, setUserName] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const movieDocRef = doc(db, 'movies', movieId);
      const movieDocSnap = await getDoc(movieDocRef);
      if (movieDocSnap.exists()) {
        setMovie(movieDocSnap.data());
      } else {
        console.error('No such movie!');
      }
    };
    fetchMovieDetails();
  }, [movieId]);

  const handleSeatSelect = (seat) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seat)
        ? prevSeats.filter((s) => s !== seat)
        : [...prevSeats, seat]
    );
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!movie || !userName || selectedSeats.length === 0) {
      alert('Please fill all details and select at least one seat.');
      return;
    }

    try {
      const movieDocRef = doc(db, 'movies', movieId);

      // Save booking under /movies/{movieId}/bookings
      await addDoc(collection(movieDocRef, 'bookings'), {
        name: userName,
        seats: selectedSeats,
        timestamp: serverTimestamp(),
      });

      // Optionally update the bookedSeats count (total, for display)
      await updateDoc(movieDocRef, {
        bookedSeats: (movie.bookedSeats || 0) + selectedSeats.length,
      });

      alert(`Booking confirmed for ${userName}! Seats: ${selectedSeats.join(', ')}`);
      setSelectedSeats([]);
      setUserName('');
    } catch (error) {
      console.error('Error booking movie:', error);
    }
  };

  const renderSeatLayout = () => {
    const rows = 5;
    const cols = 10;
    let seatIndex = 1;
    const seatGrid = [];

    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let col = 1; col <= cols; col++) {
        const seat = `${row}-${col}`;
        const isBooked = seatIndex <= (movie?.bookedSeats || 0);
        const isSelected = selectedSeats.includes(seat);

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
        seatIndex++;
      }
      seatGrid.push(
        <div key={`row-${row}`} className="seat-row">
          {rowSeats}
        </div>
      );
    }

    return seatGrid;
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="book-movie-container">
      <h1>Book Tickets for {movie.name}</h1>

      <div className="movie-details">
        <p><strong>Description:</strong> {movie.description}</p>
        <p><strong>Price:</strong> ₹{movie.price} per ticket</p>
        <p><strong>Booked Seats (count):</strong> {movie.bookedSeats || 0}</p>
      </div>

      <div className="seat-layout">{renderSeatLayout()}</div>

      <form onSubmit={handleBooking}>
        <div className="form-field">
          <label>Your Name:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-field">
          <p>Selected Seats: {selectedSeats.join(', ') || 'None'}</p>
        </div>

        <button type="submit" className="book-button">Confirm Booking</button>
      </form>
    </div>
  );
};

export default BookMovie;
