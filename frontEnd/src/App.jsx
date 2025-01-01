import { useState } from 'react'
import './App.css'
import RoomPage from './pages/RoomPage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RoomPage/>
    </>
  )
}

export default App
