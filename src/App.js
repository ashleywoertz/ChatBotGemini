import {useState} from 'react'

const App = () => {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  const surpriseOptions = [
    "What’s the most surprising food that pairs well with chocolate?",
    "What’s the most unusual pizza topping?",
    "How do you make a BLT sandwhich?",
    "If you could have any superpower for a day, what would it be?",
    "What are some fun hobbies to try?",
    "What is the best way to spend a rainy day?"
  ]

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }

  const getResponse = async() => {
    setError("")
    if(!value) {
      setError("Error! Please ask a question!")
      return
    }
    try {
      const options = {
        method: 'POST', 
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/gemini', options)
      const data = await response.text()
      console.log(data)
      setChatHistory(oldChatHistory => [
        ...oldChatHistory,
        {
            role: "user",
            parts: [{ text: value }]
        },
        {
            role: "model",
            parts: [{ text: data }]
        }
    ]);
    setValue("")

    } catch(err) {
      console.error(err)
      setError("Something went wrong! Please try again later.")
    }
  }

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }

  return (
    <div className="app">
  <header className="header">
    <h1>ChatBot</h1>
  </header>

  <div className="welcome-message">
    <p><b>Welcome to ChatBot! What would you like to know?</b></p>
  </div>

  <div className="search-section">
    <div className="search-result">
      {chatHistory.map((chatItem, _index) => (
        <div
          key={_index}
          className={chatItem.role === "user" ? "user-message" : "model-message"}
        >
          <p>{chatItem.role}: {chatItem.parts[0].text}</p>
        </div>
      ))}
    </div>

    <div className="input-container">
      <input
        value={value}
        placeholder="When is Christmas...?"
        onChange={(e) => setValue(e.target.value)}
      />
      {!error && (
        <button onClick={getResponse}>
          Send
        </button>
      )}
      {error && (
        <button onClick={clear}>
          Clear
        </button>
      )}
      <button
        className="surprise"
        onClick={surprise}
        disabled={!chatHistory}
      >
        Surprise me!
      </button>
    </div>

    {error && <p>{error}</p>}
  </div>
</div>
  
  )
}

export default App
