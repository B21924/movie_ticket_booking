import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './AddMovie.css'; // Import the CSS file

const AddMovie = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // State to hold the image URL

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
      });

      alert('🎬 Movie added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl(''); // Clear the image URL field
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
        <button type="submit" className="submit-button">
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
