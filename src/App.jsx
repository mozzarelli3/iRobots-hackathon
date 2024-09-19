import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]); // Array to store chat messages
  const [input, setInput] = useState(''); // Input state for the user's message
  
  const apiKey = import.meta.env.VITE_API_KEY;
  console.log(apiKey);
  
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