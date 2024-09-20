import { useState, useEffect } from "react";
import "./App.css";

function App() {

  // store the value of text input. We need this to use to store in the messages and display the user input
  const [inputValue, setInputValue] = useState('');
  // this stores an array of messages in the chatbot. Keeps a list of all of the users messages and bot messages
  const [messages, setMessages] = useState([]);
  // stores the data that is received from the api
  const [data, setData] = useState('');

  // links to the TMDB API
  async function searchApi() {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_AUTH}`
      }
    };

    // this gets data from the API and returns 
  try {
    const response = await fetch(url, options);
    const data = await response.json();
      setData(data.results[0].poster_path);
      return `You want this movie: ${data.results[0].title}\nOverview: ${data.results[0].overview}`;
    } catch (error) {
      console.log('error, mate');
      return 'ooooooooopppps, something went wrong'
    }
  
}
  
async function handleSubmit(e) {
  e.preventDefault();
  const userMessage = { sender: 'user', text: inputValue};
  if (userMessage.text !== '') {
    setMessages([...messages, userMessage]);

  const botResponse = await searchApi();
  const botMessage = {sender: 'bot', text: botResponse};
  setMessages(prevMessages => [...prevMessages, botMessage]);
  } else {
    setMessages([...messages, {sender: 'bot', text: 'enter some text buddy'}])
  }
  setInputValue('');
}

  return (
    <>
      <h1>Movie Recommendation Bot</h1>
      <div id="chatbot-container">
        <h1>Chatbot</h1>

        <div id="chatbot-display">
          <p>Type in below for a movie recommendation...</p>
          {/* this loops through the messages array and creates a new p element for all of the messages. */}
          {messages.map((message, index) => (
            <p key={index}>{message.text}</p>
          ))}
          {data && <img src={`https://image.tmdb.org/t/p/w500/${data}`} />}
        </div>

        <form onSubmit={handleSubmit} id="chatbot-form">
          <label>Request: </label>
          <input  
            type="text" 
            placeholder="Type your movie preference..."
            onChange={(e) => {setInputValue(e.target.value)}}
            value={inputValue} 
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default App;
