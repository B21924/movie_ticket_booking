import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './AddMovie.css'; // Import the CSS file

const AddMovie = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // State to hold the image URL
  const [showTimings, setShowTimings] = useState([]); // State to hold show timings
  const [newTiming, setNewTiming] = useState(''); // State for new show timing

  // Function to handle adding a new show timing
  const handleAddTiming = () => {
    if (newTiming) {
      setShowTimings((prevTimings) => [...prevTimings, newTiming]);
      setNewTiming(''); // Clear input after adding
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      alert('Please provide an image URL!');
      return;
    }

    try {
      // Add movie data to Firestore
      await addDoc(collection(db, 'movies'), {
        name,
        description,
        price: Number(price),
        bookedSeats: 0,
        image: imageUrl, // Store the image URL in Firestore
        showTimings, // Store the show timings in Firestore
      });

      alert('🎬 Movie added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl(''); // Clear the image URL field
      setShowTimings([]); // Clear the show timings list
    } catch (error) {
      alert('Error adding movie: ' + error.message);
    }
  };

  return (
    <div className="add-movie-container">
      <h1 className="title">🎬 Add New Movie</h1>
      <form onSubmit={handleAddMovie} className="movie-form">
        <input
          type="text"
          placeholder="Movie Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="input-field"
          rows="4"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="url"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          className="input-field"
        />

        {/* Show Timings Input */}
        <input
          type="text"
          placeholder="Add Show Timing (e.g., 10:00 AM)"
          value={newTiming}
          onChange={(e) => setNewTiming(e.target.value)}
          className="input-field"
        />
        <button type="button" onClick={handleAddTiming} className="submit-button">
          Add Timing
        </button>

        {/* Show list of added show timings */}
        <ul>
          {showTimings.map((timing, index) => (
            <li key={index}>{timing}</li>
          ))}
        </ul>

        <button type="submit" className="submit-button">
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
