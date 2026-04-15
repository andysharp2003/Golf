export default function CourseInfo({ course, onChange }) {
  return (
    <>
      <div className="card-header">
        <span className="card-icon">📍</span>
        <h2>Course Information</h2>
      </div>
      <div className="course-fields">
        <div className="form-group">
          <label htmlFor="course-name">Course Name</label>
          <input
            id="course-name"
            type="text"
            placeholder="e.g. Augusta National"
            value={course.name}
            onChange={e => onChange({ ...course, name: e.target.value })}
          />
        </div>
        <div className="form-row course-meta">
          <div className="form-group">
            <label htmlFor="hole">Hole</label>
            <select
              id="hole"
              value={course.hole}
              onChange={e => onChange({ ...course, hole: Number(e.target.value) })}
            >
              {Array.from({ length: 18 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="par">Par</label>
            <select
              id="par"
              value={course.par}
              onChange={e => onChange({ ...course, par: Number(e.target.value) })}
            >
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
        </div>
        {course.name && (
          <div className="course-badge">
            <span>🏌️ Hole {course.hole} — Par {course.par} — {course.name}</span>
          </div>
        )}
      </div>
    </>
  )
}
