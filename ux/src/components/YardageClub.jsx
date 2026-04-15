const CLUBS = [
  { name: 'Putter',           short: null,     max: 5   },
  { name: 'Lob Wedge',        short: 'LW',     max: 60  },
  { name: 'Sand Wedge',       short: 'SW',     max: 80  },
  { name: 'Gap Wedge',        short: 'GW',     max: 95  },
  { name: 'Pitching Wedge',   short: 'PW',     max: 110 },
  { name: '9 Iron',           short: '9i',     max: 120 },
  { name: '8 Iron',           short: '8i',     max: 130 },
  { name: '7 Iron',           short: '7i',     max: 140 },
  { name: '6 Iron',           short: '6i',     max: 150 },
  { name: '5 Iron',           short: '5i',     max: 160 },
  { name: '4 Iron / 4 Hybrid', short: '4i/4h', max: 170 },
  { name: '3 Hybrid',         short: '3h',     max: 183 },
  { name: '5 Wood',           short: '5w',     max: 200 },
  { name: '3 Wood',           short: '3w',     max: 220 },
  { name: 'Driver',           short: '1w',     max: Infinity },
]

function getRecommendation(yardage) {
  if (!yardage || yardage <= 0) return null
  return CLUBS.find(c => yardage <= c.max) ?? CLUBS[CLUBS.length - 1]
}

function getWindTip(windSpeed) {
  const speed = Number(windSpeed)
  if (!speed || speed === 0) return null
  if (speed <= 5)  return 'Light breeze — minimal adjustment needed.'
  if (speed <= 10) return 'Moderate wind — club up 1 for headwind, club down 1 for tailwind.'
  if (speed <= 20) return 'Strong wind — club up 1–2 for headwind, club down 1 for tailwind.'
  return 'Very strong wind — club up 2–3 for headwind; consider a low bump-and-run.'
}

export default function YardageClub({ yardage, onYardageChange, weather }) {
  const recommendation = getRecommendation(Number(yardage))
  const windTip = getWindTip(weather.windSpeed)

  return (
    <>
      <div className="card-header">
        <span className="card-icon">📏</span>
        <h2>Yardage &amp; Club</h2>
      </div>
      <div className="form-group">
        <label htmlFor="yardage">Yards to Hole</label>
        <input
          id="yardage"
          type="number"
          className="yardage-input"
          placeholder="150"
          min="1"
          value={yardage}
          onChange={e => onYardageChange(e.target.value)}
        />
      </div>
      {recommendation ? (
        <>
          <div className="divider" />
          <div className="recommendation">
            <p className="rec-label">Recommended Club</p>
            <div className="rec-badge">
              <span className="rec-club-name">{recommendation.name}</span>
              {recommendation.short && (
                <span className="rec-club-short">{recommendation.short}</span>
              )}
            </div>
          </div>
          {windTip && (
            <div className="wind-tip">
              <span className="wind-tip-icon">💨</span>
              <p>{windTip}</p>
            </div>
          )}
        </>
      ) : (
        <p className="empty-hint">Enter the distance to get a club recommendation.</p>
      )}
    </>
  )
}
