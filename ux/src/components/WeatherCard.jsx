const CONDITIONS = ['Sunny', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Heavy Rain', 'Windy', 'Foggy']
const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
const DIR_DEGREES = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 }
const CONDITION_ICONS = {
  Sunny: '☀️', 'Partly Cloudy': '⛅', Overcast: '☁️',
  'Light Rain': '🌦️', 'Heavy Rain': '🌧️', Windy: '💨', Foggy: '🌫️',
}

function WindCompass({ direction }) {
  const degrees = DIR_DEGREES[direction] ?? 0

  return (
    <div className="wind-compass">
      <svg viewBox="0 0 100 100" width="90" height="90" aria-label={`Wind from ${direction}`}>
        <circle cx="50" cy="50" r="44" fill="#f0faf4" stroke="#2d6a4f" strokeWidth="1.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
          const rad = ((deg - 90) * Math.PI) / 180
          const x1 = 50 + 38 * Math.cos(rad)
          const y1 = 50 + 38 * Math.sin(rad)
          const x2 = 50 + 44 * Math.cos(rad)
          const y2 = 50 + 44 * Math.sin(rad)
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2d6a4f" strokeWidth="1" />
        })}
        <text x="50" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1b4332">N</text>
        <text x="88" y="54" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1b4332">E</text>
        <text x="50" y="94" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1b4332">S</text>
        <text x="12" y="54" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1b4332">W</text>
        <g transform={`rotate(${degrees}, 50, 50)`}>
          <line x1="50" y1="50" x2="50" y2="20" stroke="#e9c46a" strokeWidth="3" strokeLinecap="round" />
          <polygon points="50,13 44,26 56,26" fill="#e9c46a" />
          <line x1="50" y1="50" x2="50" y2="76" stroke="#52b788" strokeWidth="2" strokeLinecap="round" strokeDasharray="4,3" />
        </g>
        <circle cx="50" cy="50" r="5" fill="#1b4332" />
      </svg>
      <p className="compass-label">From {direction}</p>
    </div>
  )
}

export default function WeatherCard({ weather, onChange }) {
  return (
    <>
      <div className="card-header">
        <span className="card-icon">{CONDITION_ICONS[weather.condition] ?? '🌤️'}</span>
        <h2>Weather Conditions</h2>
      </div>
      <div className="weather-fields">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="temp">Temperature (°F)</label>
            <input
              id="temp"
              type="number"
              placeholder="72"
              value={weather.temp}
              onChange={e => onChange({ ...weather, temp: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="condition">Condition</label>
            <select
              id="condition"
              value={weather.condition}
              onChange={e => onChange({ ...weather, condition: e.target.value })}
            >
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="divider" />
        <p className="section-sublabel">Wind</p>
        <div className="wind-layout">
          <WindCompass direction={weather.windDirection} />
          <div className="wind-inputs">
            <div className="form-group">
              <label htmlFor="wind-speed">Speed (mph)</label>
              <input
                id="wind-speed"
                type="number"
                placeholder="0"
                min="0"
                value={weather.windSpeed}
                onChange={e => onChange({ ...weather, windSpeed: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="wind-dir">Direction</label>
              <select
                id="wind-dir"
                value={weather.windDirection}
                onChange={e => onChange({ ...weather, windDirection: e.target.value })}
              >
                {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
