import { useState } from 'react'
import StatusBadge from './components/StatusBadge'
import Footer from './components/Footer'

function App() {
  const [isOpenToWork, setIsOpenToWork] = useState(true)

  const name = 'Chetha Puthi'
  const goal = 'Master React fundamentals, component architecture, and JSX to build solid web applications.'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 m-0">
              {name}
            </h1>
            <StatusBadge isOpenToWork={isOpenToWork} />
          </div>

          <p className="text-gray-600 text-base leading-relaxed mb-7 m-0">
            {goal}
          </p>

          <button
            type="button"
            className="bg-white text-gray-700 border border-gray-300 rounded-md px-3.5 py-2 text-sm font-medium hover:bg-gray-100 hover:border-gray-400 hover:text-gray-900 active:bg-gray-200 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer transition duration-150"
            onClick={() => setIsOpenToWork(!isOpenToWork)}
          >
            Toggle Status
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
