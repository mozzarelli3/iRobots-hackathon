import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MovieChatbot from './components/MovieChatbot'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="container mx-auto py-8">
      <MovieChatbot />
    </div>
    </>
  )
}

export default App
