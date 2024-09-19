import { useState } from "react";
import "./App.css";

function App() {

  // store the value of text input
  const [inputValue, setInputValue] = useState('')
  
  // onSubmit display a message in chatbot-display div
  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputValue)
  };

  return (
    <>
      <h1>Movie Recommendation Bot</h1>
      <div id="chatbot-container">
        <h1>Chatbot</h1>

        <div id="chatbot-display">
          <p>Type in below for a movie recommendation</p>
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
