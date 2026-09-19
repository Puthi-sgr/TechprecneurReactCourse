import { useState } from 'react'
import StatusBadge from './components/StatusBadge'
import './App.css'

function App() {
  const [isOpenToWork, setIsOpenToWork] = useState(true)

  const name = 'Chetha Puthi'
  const goal = 'Master React fundamentals, component architecture, and JSX to build solid web applications.'

  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-name">{name}</h1>
          <StatusBadge isOpenToWork={isOpenToWork} />
        </div>

        <p className="profile-goal">{goal}</p>

        <button
          type="button"
          className="toggle-button"
          onClick={() => setIsOpenToWork(!isOpenToWork)}
        >
          Toggle Status
        </button>
      </div>
    </main>
  )
}

export default App
