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
      // Extracts the first three movie results from the response data.
      const movies = data.results.slice(0, 3);

      // Checks if there are no movies found. If true, returns a corresponding message.
      if (movies.length === 0) {
        return `I couldn't find any movies in the genre "${genreName}". Try a different one.`;
      }

      // Create a response listing the top 3 movies
      // Maps over the movie results to create an HTML string for each movie, including the title, release year, and overview, then joins them with line breaks for spacing.
      return movies.map(movie => `<strong>${movie.title} (${movie.release_date.split('-')[0]}):</strong><br>${movie.overview}`).join('<br><br>'); 
    // Catches any errors that occur during the API call and returns an error message.
    } catch (error) {
      return `Error fetching movie recommendations: ${error.message}`;
    }
  }

  // Uses the useEffect hook to scroll to the bottom of the message list smoothly whenever the messages state changes.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // This runs when messages change

  // Function to handle user input and simulate chatbot response
  const handleSend = async () => {
    // Checks if the input is empty or consists only of whitespace. If true, exits the function.
    if (input.trim() === '') return;

    // Creates a new message object for the user and updates the messages state with the new message.
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);

    // Uses a regular expression to check if the input matches the pattern for asking for movie recommendations by genre.
    const genreMatch = input.match(/recommend some (.*) movies/i);
    // Initializes a variable responseText to hold the bot's response.
    let responseText;
    // If a genre is matched, extracts the genre name, fetches movie recommendations for that genre, and sets the response text. If no match is found, sets a default response message.
    if (genreMatch) {
      const genreName = genreMatch[1].trim();
      responseText = await getMoviesByGenre(genreName);
    } else {
      responseText = "I can recommend movies based on genre. Try saying something like 'Recommend some action movies'.";
    }
    // Updates the messages state to include the bot's response after the user's message.
    setMessages([...newMessages, { sender: 'bot', text: responseText }]);
    // Resets the input field to an empty string after sending the message.
    setInput(''); // Clear input field
  };

  // Defines a function to render the chat messages. It maps over the messages array, creating a div for each message, assigning a class based on whether it’s from the user or the bot.
  const renderMessages = () =>
    messages.map((msg, index) => (
      <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
        {msg.text}
      </div>
    ));

  // Returns the JSX structure for rendering the chat interface, including a title for the chatbot.
  return (
    <div className="chat-container">
      <h1>MovieBot</h1>
      <div className="chat-history">

        {/* Maps over the messages array to render each message. */}
        {messages.map((msg, index) => (
          
          // For each message, creates a div with a key and a class that indicates whether the message is from the user or the bot.
          <div key={index} class={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
            
            {/* Renders the bot’s message using dangerouslySetInnerHTML to interpret HTML, while the user’s message is displayed as plain text. */}
            {msg.sender === 'bot' ? (
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
            ) : (
              msg.text
            )}
          </div>
        ))}
        
        {/* Renders a target div at the end of the messages for scrolling purposes. */}
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