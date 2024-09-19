import { useState } from "react";
import "./App.css";

function App() {
  
  // onSubmit display a message in chatbot-display div
  function handleSubmit(e) {
    e.preventDefault();
    console.log(e)
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
          <input type="text" placeholder="Type your movie preference..." />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default App;
