import { useState } from 'react'
import CourseInfo from './components/CourseInfo'
import WeatherCard from './components/WeatherCard'
import YardageClub from './components/YardageClub'
import RulesAdvisor from './components/RulesAdvisor'
import './App.css'

export default function App() {
  const [course, setCourse] = useState({ name: '', hole: 1, par: 4 })
  const [weather, setWeather] = useState({
    temp: '',
    condition: 'Sunny',
    windSpeed: '',
    windDirection: 'N',
  })
  const [yardage, setYardage] = useState('')

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <span className="header-logo">⛳</span>
          <div>
            <h1>Golf Caddie</h1>
            <p>Your on-course companion</p>
          </div>
        </div>
      </header>
      <main className="app-grid">
        <section className="card course-card">
          <CourseInfo course={course} onChange={setCourse} />
        </section>
        <section className="card weather-card">
          <WeatherCard weather={weather} onChange={setWeather} />
        </section>
        <section className="card yardage-card">
          <YardageClub yardage={yardage} onYardageChange={setYardage} weather={weather} />
        </section>
        <section className="card rules-card">
          <RulesAdvisor />
        </section>
      </main>
    </div>
  )
}
