import { useState, useRef } from "react";
import "./App.css";

function App() {

    // Manage input value using uncontrolled component using a ref
    const movieRef = useRef(null);
    const [movie, setMovie] = useState(null);
  
    const apiKey = "1749dfc2"; // Replace with your OMDb API key ------------------------
    const baseURL = "https://www.omdbapi.com/";

    // function performs asynchronous operations and does not return a value, its return type is Promise<void>
    async function getMovie(movieTitle) {
      try {
        const response = await fetch(
          `${baseURL}?t=${movieTitle}&apikey=${apiKey}`
        );
  
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
  
        setMovie(data);
  
        console.log(`Movie: ${data.Title}`);
        console.log(`Year: ${data.Year}`);
        console.log(`Genre: ${data.Genre}`);
        console.log(`Plot: ${data.Plot}`);
      } catch (error) {
        console.error(`Error fetching movie data: ${error.message}`);
        setMovie(null); // Reset movie data on error
      }
    }
  
    const handleSubmit = (e) => {
      e.preventDefault(); // Prevent reload
  
      const movieTitle = movieRef.current?.value;
      if (movieTitle) {
        getMovie(movieTitle);
      }
    };

  
  return (
    <>
      <h1>Movie Recommendation Bot</h1>
      <div id="chatbot-container">

        <div id="chatbot-display">
          <h2>Type below for a movie recommendation</h2>
        </div>

        <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Movie"
          ref={movieRef}
          placeholder="Enter movie title"
        />
        <button type="submit">Search</button>
      </form>
      </div>

      {/* Conditional rendering to check if movie data is available */}
      {movie ? (
        <div>
          <h3>{movie.Title}</h3>
          <p>Year: {movie.Year}</p>
          <p>Genre: {movie.Genre}</p>
          <p>Director: {movie.Director}</p>
          <p>Plot: {movie.Plot}</p>
        </div>
      ) : (
        <p>Loading movie data...</p>
      )}
    </>
  );
}

export default App;
