// rules-data.js
// Official Rules of Golf (2023) structured for RAG
// Source: R&A and USGA Rules of Golf

export const rulesData = [
  {
    ruleId: 'Rule 13',
    title: 'Playing the Ball as It Lies',
    content: 'Rule 13 covers playing the ball as it lies. The player must not deliberately move a ball at rest or deliberately apply physical force to a ball, including throwing it. The ball must be played as it is found in its present state and position.',
  },
  {
    ruleId: 'Rule 13.1f',
    title: 'Ball on Wrong Putting Green',
    content: 'If a player\'s ball is on the wrong putting green, the player must take relief by dropping a ball in the area which provides the nearest point of complete relief outside the wrong putting green (and not in a penalty area or on another putting green). The nearest point of relief is found by placing the sole of the club in a position closest to the wrong ball position that is just outside the margin of the putting green.',
    keywords: ['wrong green', 'relief', 'drop', 'no penalty'],
  },
  {
    ruleId: 'Rule 15',
    title: 'Loose Impediments',
    content: 'A loose impediment is a natural object that is not attached or fixed to anything and is not in the state of being moved are: animal droppings, fallen leaves and branches, twigs, pine cones, stones, seed heads and seed pods, cut grass, fallen bark. You may remove loose impediments anywhere on the course without penalty.',
    keywords: ['loose impediments', 'leaves', 'twigs', 'no penalty', 'natural'],
  },
  {
    ruleId: 'Rule 15.1',
    title: 'Relief from Loose Impediments',
    content: 'A player may remove loose impediments anywhere on the course without penalty, including in bunkers and penalty areas. However, if the ball moves when removing a loose impediment, the player must replace the ball and add one penalty stroke.',
    keywords: ['loose impediments', 'no penalty', 'move ball', '1-stroke penalty'],
  },
  {
    ruleId: 'Rule 16.1',
    title: 'Relief from Immovable Obstructions and Abnormal Course Conditions',
    content: 'A player may take free relief (without penalty) if an immovable obstruction (such as a cart path, sprinkler head, drainage cover, or building) interferes with the player\'s stance or the area of intended swing. To take relief, the player must find the nearest point of complete relief and drop a ball within one club-length of that point, not closer to the hole.',
    keywords: ['cart path', 'sprinkler', 'free relief', 'no penalty', 'immovable obstruction'],
  },
  {
    ruleId: 'Rule 16.1 (Casual Water)',
    title: 'Relief from Casual Water (Temporary Water)',
    content: 'Casual water is any temporary accumulation of water that is not in a penalty area. A player may take free relief from casual water without penalty. The nearest point of complete relief is found by placing the sole of the club at the nearest place where neither the ball nor the player\'s feet are in the water. The player then drops a ball within one club-length of that point, not closer to the hole.',
    keywords: ['casual water', 'temporary water', 'puddle', 'free relief', 'no penalty'],
  },
  {
    ruleId: 'Rule 16.3',
    title: 'Relief from Embedded Ball',
    content: 'A ball is embedded when it is in its own pitch-mark and part of the ball is below the playing surface. Embedded relief is available anywhere on the course except in penalty areas or bunkers (unless a local rule extends relief to bunkers). To take relief, mark the spot, lift the ball, and drop it within one club-length directly behind the point where the ball was embedded, not closer to the hole. This relief is free (no penalty).',
    keywords: ['embedded', 'plugged lie', 'pitch-mark', 'free relief', 'no penalty'],
  },
  {
    ruleId: 'Rule 17',
    title: 'Penalty Areas (Water Hazards)',
    content: 'A penalty area is defined by red or yellow stakes, lines, or painted margins and includes water hazards. If a ball is in a penalty area, the player has several options, each with a one-stroke penalty: (1) Stroke and distance - return to where the original shot was played and play again, (2) Back-on-the-line relief - drop anywhere on a line going back from the hole through where the ball last crossed the margin of the penalty area, (3) Lateral relief (red penalty areas only) - drop within two club-lengths of where the ball last crossed the margin, no closer to the hole.',
    keywords: ['penalty area', 'water hazard', 'Rule 17', '1-stroke penalty', 'relief options'],
  },
  {
    ruleId: 'Rule 18.2',
    title: 'Lost Ball and Out of Bounds',
    content: 'A ball is lost if it cannot be found within 3 minutes of starting to search. If a ball is lost, the player must go back to where the original shot was played, add one penalty stroke, and play another ball (stroke and distance). If a ball goes out of bounds, it is also governed by stroke and distance - return to the spot of the previous stroke, add one penalty stroke, and play again. A player may play a provisional ball if they think their ball may be lost or out of bounds.',
    keywords: ['lost ball', 'out of bounds', 'OB', '3 minutes', '1-stroke penalty', 'stroke and distance'],
  },
  {
    ruleId: 'Rule 19',
    title: 'Unplayable Ball',
    content: 'A player may declare a ball unplayable at any time, except when the ball is in a penalty area. The player must add one penalty stroke and choose one of three options: (1) Stroke and distance - replay from the original spot, (2) Back-on-the-line relief - drop anywhere behind the ball keeping it on a line to the hole, (3) Lateral relief - drop within two club-lengths of where the ball lies, not closer to the hole. In a bunker, lateral relief must be taken in the bunker, or the player may drop outside the bunker for a total of 2 penalty strokes.',
    keywords: ['unplayable lie', 'unplayable ball', 'Rule 19', '1-stroke penalty', 'relief options'],
  },
  {
    ruleId: 'Rule 6.3c',
    title: 'Wrong Ball Played',
    content: 'In stroke play, if a player plays a wrong ball, the player gets a two-stroke penalty and must continue the hole with the correct ball. Strokes made with the wrong ball do not count. In match play, the player loses the hole immediately. To avoid this, mark your ball with a unique identification.',
    keywords: ['wrong ball', '2-stroke penalty', 'stroke play', 'correct ball'],
  },
  {
    ruleId: 'Rule 1.3b',
    title: 'General Penalty',
    content: 'The general penalty in stroke play is two strokes. In match play, the general penalty is loss of hole. These apply to most rule violations unless specifically stated otherwise.',
    keywords: ['penalty', 'general penalty', '2 strokes', 'loss of hole'],
  },
];

export default rulesData;
