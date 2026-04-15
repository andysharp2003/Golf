import { useState } from 'react'

const SITUATIONS = [
  {
    id: 'penalty-area',
    label: 'Ball in Penalty Area (Water Hazard)',
    rule: 'Rule 17',
    advice: `You have three relief options, each with a 1-stroke penalty:

1. Stroke and Distance — play again from where you hit the original shot.
2. Back-on-the-line Relief — drop anywhere on the line going back from the hole through where your ball last crossed the margin (no distance limit back).
3. Lateral Relief (red penalty areas only) — drop within two club-lengths of where the ball last crossed the margin, no closer to the hole.`,
  },
  {
    id: 'out-of-bounds',
    label: 'Out of Bounds',
    rule: 'Rule 18.2',
    advice: `Under standard rules your only option is stroke and distance — return to where the original shot was played and add 1 penalty stroke.

If the Committee has adopted Local Rule E-5, you may instead take lateral relief near where the ball went OB with a 2-stroke penalty, avoiding the trip back to the tee.

Tip: if you suspect OB, play a provisional ball before searching — it saves significant time.`,
  },
  {
    id: 'unplayable',
    label: 'Unplayable Lie',
    rule: 'Rule 19',
    advice: `You may declare any ball unplayable anywhere except in a penalty area. All three options carry a 1-stroke penalty:

1. Stroke and Distance — replay from the original spot.
2. Back-on-the-line Relief — drop anywhere behind the unplayable spot, keeping it between you and the hole.
3. Lateral Relief — drop within two club-lengths of the unplayable spot, no closer to the hole.

In a bunker: options 2 and 3 must be taken inside the bunker, or you may drop outside behind the bunker for 2 penalty strokes total.`,
  },
  {
    id: 'temp-water',
    label: 'Temporary Water (Casual Water)',
    rule: 'Rule 16.1',
    advice: `Free relief — no penalty stroke.

Find the nearest point of complete relief outside the temporary water (in the same area of the course) and drop within one club-length of that point, no closer to the hole.

On the putting green, you may place the ball at the nearest point of relief rather than dropping it.`,
  },
  {
    id: 'cart-path',
    label: 'Ball on Cart Path / Immovable Obstruction',
    rule: 'Rule 16.1',
    advice: `Free relief from immovable obstructions (cart paths, sprinkler heads, drainage covers, etc.).

Find the nearest point of complete relief — where neither your stance nor swing is affected — and drop within one club-length of that point, no closer to the hole.

Note: you are never required to take relief; you may always play the ball as it lies if you choose.`,
  },
  {
    id: 'lost-ball',
    label: 'Lost Ball',
    rule: 'Rule 18.2',
    advice: `A ball is lost if it cannot be found within 3 minutes of beginning to search.

You must return to where the original shot was played and replay with a 1-stroke penalty (stroke and distance).

Tip: if you suspect your ball may be lost, play a provisional ball immediately before going forward to search. This prevents the time-consuming walk back if the ball is not found.`,
  },
  {
    id: 'wrong-ball',
    label: 'Wrong Ball Played',
    rule: 'Rule 6.3c',
    advice: `Stroke play: a 2-stroke penalty is applied. You must correct the mistake by playing the correct ball; strokes made with the wrong ball do not count. If the correct ball cannot be found, it is deemed lost — apply the stroke-and-distance rule.

Match play: you lose the hole immediately upon playing a wrong ball (except in a hazard).

Always mark your ball with a unique identification mark to avoid this situation.`,
  },
  {
    id: 'embedded',
    label: 'Embedded Ball (Plugged Lie)',
    rule: 'Rule 16.3',
    advice: `Free relief anywhere on the course except in penalty areas and bunkers (unless a Local Rule extends relief to bunkers).

Mark the spot, lift the ball, and drop it within one club-length directly behind where the ball was embedded — no closer to the hole.

A ball is considered embedded when it is in its own pitch-mark and part of the ball is below the level of the ground.`,
  },
  {
    id: 'loose-impediments',
    label: 'Loose Impediments (Leaves, Twigs, etc.)',
    rule: 'Rule 15.1',
    advice: `You may remove any natural loose impediment (leaves, twigs, acorns, stones, animal droppings, etc.) anywhere on the course without penalty — including in bunkers and penalty areas under the 2019 Rules.

Caution: if your ball moves while you are removing a loose impediment, you must replace it and take a 1-stroke penalty.`,
  },
  {
    id: 'wrong-green',
    label: 'Ball on Wrong Putting Green',
    rule: 'Rule 13.1f',
    advice: `You must take free relief — you are not permitted to play from a wrong putting green.

Find the nearest point of complete relief off the wrong green (not in a penalty area or on another putting green) and drop within one club-length of that point, no closer to the hole.

This rule applies even if you could physically play the shot without touching the green surface.`,
  },
]

export default function RulesAdvisor() {
  const [selected, setSelected] = useState('')
  const situation = SITUATIONS.find(s => s.id === selected)

  return (
    <>
      <div className="card-header">
        <span className="card-icon">📋</span>
        <h2>Rules Advisor</h2>
      </div>
      <div className="form-group">
        <label htmlFor="situation">Select Situation</label>
        <select
          id="situation"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">— Choose a situation —</option>
          {SITUATIONS.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
      {situation ? (
        <>
          <div className="divider" />
          <div className="rules-advice">
            <div className="rule-badge">{situation.rule}</div>
            <h3 className="situation-title">{situation.label}</h3>
            <p className="advice-text">{situation.advice}</p>
          </div>
        </>
      ) : (
        <p className="empty-hint">Select a situation to get rules guidance.</p>
      )}
    </>
  )
}
