'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const MovieChatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your movie suggestion bot. What kind of movie are you in the mood for?", isUser: false }
  ])
  const [input, setInput] = useState('')

  const fetchMovieSuggestions = async (query) => {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
    )
    const data = await response.json()
    return data.results.slice(0, 3)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { text: input, isUser: true }
    setMessages(prevMessages => [...prevMessages, userMessage])
    setInput('')

    try {
      const movies = await fetchMovieSuggestions(input)
      const botResponse = movies.length > 0
        ? `Here are some movie suggestions based on your input:\n\n${movies.map(movie => 
            `- ${movie.title} (${movie.release_date.split('-')[0]}): ${movie.overview}`
          ).join('\n\n')}`
        : "I'm sorry, I couldn't find any movies matching your request. Could you try a different genre or description?"

      setMessages(prevMessages => [...prevMessages, { text: botResponse, isUser: false }])
    } catch (error) {
      console.error('Error fetching movie suggestions:', error)
      setMessages(prevMessages => [...prevMessages, { text: "I'm sorry, there was an error fetching movie suggestions. Please try again later.", isUser: false }])
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Movie Suggestion Chatbot</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] mb-4 p-4 border rounded-md">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.isUser ? 'text-right' : 'text-left'
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </span>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your movie preference..."
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default MovieChatbot