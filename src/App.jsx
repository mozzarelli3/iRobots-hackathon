// import { useState, useRef } from "react";
// import "./App.css";

// function App() {

//     // Manage input value using uncontrolled component using a ref
//     const movieRef = useRef(null);
//     const [movie, setMovie] = useState(null);
  
//     const apiKey = "1749dfc2"; // Replace with your OMDb API key ------------------------
//     const baseURL = "https://www.omdbapi.com/";

//     // function performs asynchronous operations and does not return a value, its return type is Promise<void>
//     async function getMovie(movieTitle) {
//       try {
//         const response = await fetch(
//           `${baseURL}?t=${movieTitle}&apikey=${apiKey}`
//         );
  
//         // Check if the request was successful
//         if (!response.ok) {
//           throw new Error(`Error: ${response.statusText}`);
//         }
  
//         const data = await response.json();
//         if (data.Response === "False") {
//           throw new Error(data.Error);
//         }
  
//         setMovie(data);
  
//         console.log(`Movie: ${data.Title}`);
//         console.log(`Year: ${data.Year}`);
//         console.log(`Genre: ${data.Genre}`);
//         console.log(`Plot: ${data.Plot}`);
//       } catch (error) {
//         console.error(`Error fetching movie data: ${error.message}`);
//         setMovie(null); // Reset movie data on error
//       }
//     }
  
//     const handleSubmit = (e) => {
//       e.preventDefault(); // Prevent reload
  
//       const movieTitle = movieRef.current?.value;
//       if (movieTitle) {
//         getMovie(movieTitle);
//       }
//     };

  
//   return (
//     <>
//       <h1>Movie Recommendation Bot</h1>
//       <div id="chatbot-container">

//         <div id="chatbot-display">
//           <h2>Type below for a movie recommendation</h2>
//         </div>

//         <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="Movie"
//           ref={movieRef}
//           placeholder="Enter movie title"
//         />
//         <button type="submit">Search</button>
//       </form>
//       </div>

//       {/* Conditional rendering to check if movie data is available */}
//       {movie ? (
//         <div>
//           <h3>{movie.Title}</h3>
//           <p>Year: {movie.Year}</p>
//           <p>Genre: {movie.Genre}</p>
//           <p>Director: {movie.Director}</p>
//           <p>Plot: {movie.Plot}</p>
//         </div>
//       ) : (
//         <p>Loading movie data...</p>
//       )}
//     </>
//   );
// }

// export default App;
// ---------------------------------------------------------------------------------------------------




import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]); // Array to store chat messages
  const [input, setInput] = useState(''); // Input state for the user's message
  const apiKey = process.env.REACT_APP_API_KEY;
  const baseURL = "https://api.themoviedb.org/3";
  const genres = { // A mapping of genre names to genre IDs
    action: 28,
    comedy: 35,
    drama: 18,
    horror: 27,
    romance: 10749,
    animation: 12,
    documentary: 99,
    fantasy: 14,
    thriller: 53,
    mystery: 9648,
    war: 10752,
    family: 10751,
    // Add more genres as needed
  };

  // Creates a reference (messagesEndRef) that will point to the end of the messages list for scrolling.
  const messagesEndRef = useRef(null);

  // Declares an asynchronous function getMoviesByGenre that takes a genreName string as an argument.
  async function getMoviesByGenre(genreName) {
    // Looks up the genre ID from the genres object based on the provided genre name (converted to lowercase).
    const genreId = genres[genreName.toLowerCase()];
    // If the genre ID is not found (i.e., genreId is undefined), returns an error message.
    if (!genreId) {
      return `Sorry, I don't recognize the genre "${genreName}". Please try again with a different genre.`;
    }

    try {
      // Makes an API request to fetch movies of the specified genre using the fetch function, awaiting the response.
      const response = await fetch(
        `${baseURL}/discover/movie?with_genres=${genreId}&api_key=${apiKey}`
      );
      // Checks if the response is successful (status code 200-299). If not, throws an error with the response status text.
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Parses the JSON data from the response.
      const data = await response.json();
      const movies = data.results.slice(0, 3); // Get top 3 movies
//----------------------------------------------------------------
      if (movies.length === 0) {
        return `I couldn't find any movies in the genre "${genreName}". Try a different one.`;
      }

      // Create a response listing the top 3 movies
      return movies.map(movie => `<strong>${movie.title} (${movie.release_date.split('-')[0]}):</strong><br>${movie.overview}`).join('<br><br>'); // Use join to add a break between movies
    } catch (error) {
      return `Error fetching movie recommendations: ${error.message}`;
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // This runs when messages change

  // Function to handle user input and simulate chatbot response
  const handleSend = async () => {
    if (input.trim() === '') return;

    // Add user message to chat history
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);

    // Check if user is asking for movie recommendations by genre
    const genreMatch = input.match(/recommend some (.*) movies/i);
    let responseText;
    if (genreMatch) {
      const genreName = genreMatch[1].trim();
      responseText = await getMoviesByGenre(genreName);
    } else {
      responseText = "I can recommend movies based on genre. Try saying something like 'Recommend some action movies'.";
    }

    setMessages([...newMessages, { sender: 'bot', text: responseText }]);
    setInput(''); // Clear input field
  };

  // Render chat history
  const renderMessages = () =>
    messages.map((msg, index) => (
      <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
        {msg.text}
      </div>
    ));

  return (
    <div className="chat-container">
      <h1>MovieBot</h1>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
            {msg.sender === 'bot' ? (
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
            ) : (
              msg.text
            )}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about movies..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;