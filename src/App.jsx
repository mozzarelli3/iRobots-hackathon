import { useState } from "react";
import "./App.css";

function App() {
  const handleSubmit = (e) => {
    e.preventDeault();
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
          <input
            type="text"
            placeholder="Type your movie preference..."
            class="flex-grow"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default App;
