import { useState } from "react";
import "./App.css";

function App() {

  const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMDI1ODVhYWY3M2JjNDRlMWJiZjA5YTA2NjIxYzFkNyIsIm5iZiI6MTcyNjc2NTYxNS4wMDQ0MTIsInN1YiI6IjY2ZWM1ODRjNGEyY2QzZGM4ZDQ2YzUyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.W8z_EKAG6qMSLJaOoHdSkMKKpnifPYWmaizQVKZ6BII'
    }
  };
  async function searchApi() {
  try {
  const response = await fetch(url, options)
  const data = await response.json()
    setData(data.results[0].poster_path)
  } catch (error) {
    console.log('error, mate')
  }
}

  // store the value of text input. We need this to use to store in the messages and display the user input
  const [inputValue, setInputValue] = useState('');
  // this stores an array of messages in the chatbot. Keeps a list of all of the users messages and bot messages
  const [messages, setMessages] = useState([]);

  const [data, setData] = useState('');
  
  // onSubmit display a message in chatbot-display div
  function handleSubmit(e) {
    // prevents the forms default setting which reloads the page when the button is pressed.
    e.preventDefault();
    // this creates a new array that copys what is in messages already and adds an object with the input value
    setMessages([...messages, {text: inputValue}])

    searchApi()

    // after the form is submitted, the input box becomes empty again
    setInputValue('')
  };

  return (
    <>
      <h1>Movie Recommendation Bot</h1>
      <div id="chatbot-container">
        <h1>Chatbot</h1>

        <div id="chatbot-display">
          <p>Type in below for a movie recommendation</p>
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
