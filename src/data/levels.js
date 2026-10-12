// Handcrafted & Algorithmic 200-Level Campaign Dataset
// 20 Thematic Chapters, 10 Levels Each (3x3 to 8x8 Grids)
export const LEVELS = [
  {
    "name": "Learn Distance",
    "phase": "Origins",
    "w": 3,
    "h": 3,
    "start": [
      0,
      0
    ],
    "goal": [
      0,
      2
    ],
    "grid": [
      [
        2,
        3,
        4
      ],
      [
        1,
        2,
        3
      ],
      [
        4,
        1,
        2
      ]
    ],
    "optimal": 1
  },
  {
    "name": "Cardinal Choice",
    "phase": "Origins",
    "w": 3,
    "h": 3,
    "start": [
      0,
      0
    ],
    "goal": [
      2,
      1
    ],
    "grid": [
      [
        1,
        2,
        3
      ],
      [
        3,
        4,
        1
      ],
      [
        2,
        4,
        4
      ]
    ],
    "optimal": 2
  },
  {
    "name": "Center Out",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      2,
      2
    ],
    "goal": [
      3,
      0
    ],
    "grid": [
      [
        1,
        1,
        3,
        1
      ],
      [
        2,
        2,
        1,
        3
      ],
      [
        2,
        2,
        1,
        3
      ],
      [
        1,
        1,
        3,
        3
      ]
    ],
    "optimal": 4
  },
  {
    "name": "The U-Turn",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      0,
      3
    ],
    "goal": [
      3,
      0
    ],
    "grid": [
      [
        2,
        3,
        3,
        3
      ],
      [
        2,
        2,
        3,
        2
      ],
      [
        3,
        2,
        2,
        1
      ],
      [
        1,
        3,
        2,
        1
      ]
    ],
    "optimal": 3
  },
  {
    "name": "Diagonal Cross",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      0,
      0
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        1,
        2,
        1,
        2
      ],
      [
        2,
        2,
        1,
        2
      ],
      [
        1,
        2,
        1,
        2
      ],
      [
        3,
        3,
        2,
        2
      ]
    ],
    "optimal": 3
  },
  {
    "name": "The S-Curve",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      2,
      0
    ],
    "goal": [
      2,
      3
    ],
    "grid": [
      [
        1,
        3,
        2,
        2
      ],
      [
        1,
        3,
        1,
        2
      ],
      [
        1,
        3,
        3,
        1
      ],
      [
        1,
        2,
        1,
        3
      ]
    ],
    "optimal": 5
  },
  {
    "name": "The Pinwheel",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      3,
      3
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        1,
        2,
        2
      ],
      [
        2,
        2,
        3,
        1
      ],
      [
        1,
        1,
        3,
        3
      ],
      [
        2,
        1,
        3,
        2
      ]
    ],
    "optimal": 4
  },
  {
    "name": "Bullseye",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      0,
      2
    ],
    "goal": [
      3,
      2
    ],
    "grid": [
      [
        1,
        3,
        2,
        3
      ],
      [
        1,
        1,
        2,
        1
      ],
      [
        3,
        2,
        3,
        2
      ],
      [
        3,
        2,
        1,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "The Loop Trap",
    "phase": "Origins",
    "w": 5,
    "h": 5,
    "start": [
      4,
      2
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        2,
        1,
        2,
        3,
        2
      ],
      [
        2,
        1,
        2,
        2,
        1
      ],
      [
        2,
        3,
        1,
        1,
        3
      ],
      [
        3,
        2,
        3,
        1,
        2
      ],
      [
        1,
        1,
        3,
        3,
        3
      ]
    ],
    "optimal": 4
  },
  {
    "name": "Origins Climax",
    "phase": "Origins",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        3,
        1,
        3
      ],
      [
        1,
        4,
        2,
        4,
        2
      ],
      [
        4,
        4,
        3,
        4,
        2
      ],
      [
        4,
        3,
        1,
        4,
        2
      ],
      [
        1,
        1,
        1,
        3,
        3
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Pivot Angle",
    "phase": "The Pivot",
    "w": 4,
    "h": 4,
    "start": [
      0,
      0
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        2,
        1,
        1,
        1
      ],
      [
        3,
        3,
        1,
        2
      ],
      [
        1,
        3,
        1,
        1
      ],
      [
        2,
        1,
        3,
        1
      ]
    ],
    "optimal": 4
  },
  {
    "name": "Perimeter Leap",
    "phase": "The Pivot",
    "w": 4,
    "h": 4,
    "start": [
      3,
      0
    ],
    "goal": [
      0,
      3
    ],
    "grid": [
      [
        2,
        3,
        1,
        1
      ],
      [
        3,
        3,
        2,
        3
      ],
      [
        2,
        3,
        2,
        2
      ],
      [
        1,
        2,
        1,
        2
      ]
    ],
    "optimal": 4
  },
  {
    "name": "Double Cross",
    "phase": "The Pivot",
    "w": 4,
    "h": 4,
    "start": [
      2,
      2
    ],
    "goal": [
      3,
      0
    ],
    "grid": [
      [
        2,
        1,
        3,
        3
      ],
      [
        1,
        3,
        1,
        1
      ],
      [
        3,
        1,
        2,
        2
      ],
      [
        1,
        1,
        1,
        3
      ]
    ],
    "optimal": 4
  },
  {
    "name": "Reflected Vector",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      0,
      4
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        3,
        2,
        1,
        4,
        1
      ],
      [
        3,
        2,
        2,
        3,
        3
      ],
      [
        1,
        4,
        2,
        1,
        1
      ],
      [
        2,
        4,
        2,
        4,
        3
      ],
      [
        1,
        3,
        2,
        4,
        3
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Inner Square",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        3,
        3,
        2,
        3,
        2
      ],
      [
        2,
        4,
        1,
        3,
        3
      ],
      [
        2,
        2,
        1,
        3,
        1
      ],
      [
        4,
        3,
        4,
        3,
        3
      ],
      [
        2,
        3,
        4,
        1,
        4
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Deceptive 3",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      2,
      0
    ],
    "goal": [
      2,
      4
    ],
    "grid": [
      [
        2,
        2,
        2,
        2,
        3
      ],
      [
        1,
        1,
        3,
        3,
        1
      ],
      [
        1,
        2,
        3,
        2,
        1
      ],
      [
        3,
        4,
        3,
        1,
        2
      ],
      [
        4,
        2,
        1,
        1,
        4
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Deadly Turn",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      4,
      4
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        2,
        1,
        1
      ],
      [
        4,
        2,
        1,
        4,
        1
      ],
      [
        1,
        4,
        4,
        1,
        4
      ],
      [
        2,
        4,
        2,
        3,
        1
      ],
      [
        2,
        3,
        1,
        4,
        3
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Narrow Bridge",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      0,
      2
    ],
    "goal": [
      4,
      2
    ],
    "grid": [
      [
        1,
        1,
        1,
        1,
        3
      ],
      [
        3,
        1,
        1,
        3,
        2
      ],
      [
        4,
        4,
        4,
        1,
        2
      ],
      [
        3,
        1,
        2,
        4,
        3
      ],
      [
        2,
        1,
        1,
        2,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Trapped In Corner",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      4,
      2
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        2,
        4,
        4,
        1,
        2
      ],
      [
        4,
        4,
        3,
        4,
        2
      ],
      [
        2,
        1,
        1,
        4,
        3
      ],
      [
        1,
        1,
        4,
        1,
        2
      ],
      [
        1,
        3,
        1,
        4,
        4
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Pivot Master",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        2,
        2,
        1,
        3
      ],
      [
        4,
        1,
        4,
        2,
        2
      ],
      [
        1,
        2,
        4,
        2,
        1
      ],
      [
        1,
        4,
        2,
        2,
        1
      ],
      [
        1,
        3,
        3,
        4,
        1
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Open Field",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        3,
        3,
        4,
        4,
        4
      ],
      [
        3,
        3,
        3,
        4,
        2
      ],
      [
        2,
        1,
        4,
        1,
        2
      ],
      [
        3,
        1,
        3,
        1,
        2
      ],
      [
        4,
        2,
        1,
        4,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Five Steps",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      4
    ],
    "grid": [
      [
        1,
        4,
        3,
        3,
        1
      ],
      [
        2,
        3,
        3,
        1,
        1
      ],
      [
        1,
        2,
        2,
        3,
        3
      ],
      [
        1,
        2,
        3,
        1,
        2
      ],
      [
        3,
        1,
        2,
        1,
        2
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Crossroad Axis",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      2,
      2
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        4,
        2,
        4,
        3,
        3
      ],
      [
        4,
        1,
        4,
        4,
        3
      ],
      [
        3,
        1,
        2,
        2,
        3
      ],
      [
        3,
        2,
        1,
        1,
        1
      ],
      [
        1,
        2,
        4,
        1,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Alternating Pace",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      0,
      4
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        1,
        2,
        2,
        4,
        2
      ],
      [
        2,
        3,
        2,
        1,
        2
      ],
      [
        1,
        1,
        1,
        3,
        3
      ],
      [
        1,
        1,
        3,
        4,
        1
      ],
      [
        1,
        2,
        3,
        1,
        3
      ]
    ],
    "optimal": 5
  },
  {
    "name": "The Diagonal Trap",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        4,
        4,
        1,
        1,
        3
      ],
      [
        3,
        2,
        1,
        1,
        4
      ],
      [
        4,
        3,
        1,
        1,
        1
      ],
      [
        3,
        2,
        2,
        3,
        3
      ],
      [
        1,
        1,
        3,
        2,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Cycle Break",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      2,
      0
    ],
    "goal": [
      2,
      4
    ],
    "grid": [
      [
        4,
        3,
        3,
        1,
        1
      ],
      [
        3,
        1,
        4,
        2,
        1
      ],
      [
        3,
        4,
        2,
        2,
        1
      ],
      [
        3,
        1,
        1,
        1,
        4
      ],
      [
        1,
        2,
        1,
        2,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Centering",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      4,
      4
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        1,
        4,
        1
      ],
      [
        1,
        4,
        2,
        1,
        2
      ],
      [
        1,
        2,
        2,
        2,
        3
      ],
      [
        1,
        2,
        4,
        1,
        3
      ],
      [
        1,
        1,
        1,
        4,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Woven Paths",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      0,
      2
    ],
    "goal": [
      4,
      2
    ],
    "grid": [
      [
        3,
        2,
        3,
        3,
        2
      ],
      [
        4,
        4,
        1,
        4,
        4
      ],
      [
        4,
        2,
        1,
        2,
        4
      ],
      [
        4,
        1,
        2,
        1,
        4
      ],
      [
        3,
        1,
        1,
        3,
        2
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Hidden Choice",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      4,
      2
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        2,
        3,
        3,
        4,
        3
      ],
      [
        2,
        3,
        2,
        4,
        4
      ],
      [
        2,
        2,
        1,
        3,
        4
      ],
      [
        4,
        2,
        3,
        1,
        1
      ],
      [
        2,
        1,
        3,
        4,
        1
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Vector Climax",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        3,
        3,
        4
      ],
      [
        1,
        4,
        1,
        1,
        3
      ],
      [
        4,
        4,
        1,
        2,
        3
      ],
      [
        1,
        1,
        2,
        3,
        1
      ],
      [
        2,
        2,
        4,
        3,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Tempting Branch",
    "phase": "Crossroads",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        3,
        4,
        2,
        3,
        3
      ],
      [
        2,
        1,
        2,
        4,
        1
      ],
      [
        4,
        2,
        3,
        1,
        1
      ],
      [
        3,
        3,
        2,
        1,
        2
      ],
      [
        1,
        3,
        1,
        2,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Echo Lane",
    "phase": "Crossroads",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      4
    ],
    "grid": [
      [
        3,
        4,
        2,
        2,
        1
      ],
      [
        3,
        2,
        1,
        3,
        1
      ],
      [
        3,
        1,
        3,
        2,
        3
      ],
      [
        2,
        2,
        3,
        4,
        4
      ],
      [
        3,
        3,
        1,
        2,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Mirror Step",
    "phase": "Crossroads",
    "w": 5,
    "h": 5,
    "start": [
      2,
      2
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        3,
        4,
        3,
        4,
        4
      ],
      [
        4,
        2,
        4,
        1,
        2
      ],
      [
        4,
        4,
        1,
        3,
        2
      ],
      [
        1,
        3,
        1,
        4,
        2
      ],
      [
        1,
        2,
        4,
        3,
        2
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Long Span",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      0,
      5
    ],
    "goal": [
      5,
      0
    ],
    "grid": [
      [
        4,
        1,
        2,
        5,
        3,
        1
      ],
      [
        5,
        3,
        1,
        2,
        3,
        3
      ],
      [
        5,
        3,
        1,
        5,
        5,
        1
      ],
      [
        3,
        5,
        5,
        2,
        1,
        1
      ],
      [
        5,
        2,
        2,
        2,
        5,
        2
      ],
      [
        1,
        4,
        1,
        5,
        1,
        5
      ]
    ],
    "optimal": 7
  },
  {
    "name": "The Spiral",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      0,
      0
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        1,
        5,
        2,
        4,
        3,
        4
      ],
      [
        3,
        1,
        4,
        5,
        1,
        1
      ],
      [
        5,
        4,
        1,
        1,
        1,
        3
      ],
      [
        1,
        2,
        3,
        1,
        5,
        5
      ],
      [
        2,
        3,
        2,
        5,
        3,
        3
      ],
      [
        2,
        4,
        5,
        2,
        1,
        1
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Decoy Trail",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      3,
      0
    ],
    "goal": [
      3,
      5
    ],
    "grid": [
      [
        4,
        3,
        3,
        4,
        2,
        2
      ],
      [
        2,
        2,
        2,
        2,
        5,
        3
      ],
      [
        1,
        4,
        3,
        2,
        2,
        5
      ],
      [
        3,
        4,
        2,
        5,
        3,
        1
      ],
      [
        4,
        3,
        5,
        1,
        5,
        2
      ],
      [
        2,
        1,
        5,
        3,
        1,
        4
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Shadow Route",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      5,
      5
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        5,
        4,
        1,
        3,
        3
      ],
      [
        4,
        5,
        2,
        5,
        5,
        4
      ],
      [
        4,
        3,
        5,
        1,
        4,
        3
      ],
      [
        3,
        4,
        3,
        3,
        5,
        5
      ],
      [
        3,
        4,
        1,
        4,
        1,
        3
      ],
      [
        2,
        5,
        5,
        3,
        1,
        3
      ]
    ],
    "optimal": 7
  },
  {
    "name": "The False Choice",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      0,
      3
    ],
    "goal": [
      5,
      3
    ],
    "grid": [
      [
        2,
        5,
        2,
        3,
        4,
        2
      ],
      [
        4,
        3,
        5,
        5,
        3,
        1
      ],
      [
        4,
        2,
        1,
        5,
        1,
        3
      ],
      [
        3,
        4,
        4,
        1,
        5,
        4
      ],
      [
        3,
        3,
        2,
        5,
        5,
        2
      ],
      [
        5,
        2,
        5,
        1,
        4,
        4
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Deep Lookahead",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      5,
      3
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        5,
        4,
        1,
        2,
        3,
        5
      ],
      [
        5,
        5,
        5,
        5,
        4,
        2
      ],
      [
        1,
        3,
        2,
        4,
        4,
        1
      ],
      [
        4,
        3,
        3,
        1,
        5,
        2
      ],
      [
        1,
        4,
        1,
        3,
        5,
        2
      ],
      [
        3,
        1,
        4,
        5,
        4,
        5
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Crossroads Trial",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      5,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        1,
        1,
        4,
        5,
        2
      ],
      [
        4,
        3,
        4,
        4,
        2,
        4
      ],
      [
        4,
        3,
        2,
        4,
        4,
        3
      ],
      [
        4,
        4,
        2,
        5,
        3,
        4
      ],
      [
        3,
        4,
        2,
        2,
        5,
        3
      ],
      [
        4,
        2,
        1,
        1,
        3,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "The Trench",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        1,
        2,
        2,
        3,
        1
      ],
      [
        1,
        2,
        3,
        4,
        1
      ],
      [
        1,
        2,
        4,
        0,
        3
      ],
      [
        3,
        3,
        1,
        1,
        1
      ],
      [
        0,
        0,
        4,
        3,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "The Gap",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      4
    ],
    "grid": [
      [
        1,
        4,
        1,
        4,
        1
      ],
      [
        0,
        3,
        0,
        2,
        3
      ],
      [
        1,
        1,
        1,
        0,
        0
      ],
      [
        1,
        4,
        0,
        2,
        4
      ],
      [
        2,
        2,
        4,
        1,
        4
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Single Island",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      2,
      2
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        2,
        4,
        3,
        1,
        3
      ],
      [
        2,
        2,
        3,
        2,
        3
      ],
      [
        3,
        3,
        2,
        1,
        1
      ],
      [
        3,
        4,
        1,
        3,
        2
      ],
      [
        1,
        1,
        4,
        3,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Leap Across",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      0,
      4
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        0,
        3,
        4,
        3,
        3
      ],
      [
        2,
        1,
        4,
        4,
        2
      ],
      [
        2,
        3,
        1,
        4,
        2
      ],
      [
        1,
        4,
        3,
        4,
        1
      ],
      [
        1,
        2,
        2,
        0,
        1
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Twin Chasms",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        1,
        0,
        2,
        1,
        4
      ],
      [
        1,
        4,
        1,
        1,
        0
      ],
      [
        1,
        2,
        1,
        0,
        0
      ],
      [
        2,
        2,
        4,
        1,
        2
      ],
      [
        4,
        1,
        3,
        1,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Divided Board",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      2,
      0
    ],
    "goal": [
      2,
      4
    ],
    "grid": [
      [
        4,
        4,
        4,
        1,
        3
      ],
      [
        3,
        0,
        0,
        0,
        4
      ],
      [
        1,
        2,
        1,
        0,
        1
      ],
      [
        2,
        4,
        3,
        2,
        1
      ],
      [
        4,
        0,
        0,
        0,
        4
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Hollow Bridge",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      4,
      4
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        3,
        2,
        1
      ],
      [
        2,
        3,
        3,
        2,
        2
      ],
      [
        2,
        1,
        4,
        4,
        3
      ],
      [
        3,
        4,
        2,
        1,
        2
      ],
      [
        0,
        1,
        0,
        4,
        4
      ]
    ],
    "optimal": 6
  },
  {
    "name": "River of Voids",
    "phase": "The Chasm I",
    "w": 6,
    "h": 6,
    "start": [
      0,
      3
    ],
    "goal": [
      5,
      3
    ],
    "grid": [
      [
        3,
        2,
        1,
        1,
        4,
        1
      ],
      [
        0,
        1,
        0,
        1,
        2,
        0
      ],
      [
        0,
        2,
        3,
        2,
        0,
        5
      ],
      [
        3,
        1,
        0,
        0,
        2,
        2
      ],
      [
        3,
        0,
        2,
        0,
        5,
        3
      ],
      [
        3,
        2,
        0,
        1,
        4,
        1
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Island Hopper",
    "phase": "The Chasm I",
    "w": 6,
    "h": 6,
    "start": [
      5,
      3
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        1,
        4,
        4,
        5,
        4,
        2
      ],
      [
        2,
        0,
        1,
        5,
        0,
        1
      ],
      [
        0,
        2,
        2,
        3,
        0,
        4
      ],
      [
        0,
        5,
        5,
        1,
        3,
        2
      ],
      [
        3,
        0,
        1,
        1,
        5,
        5
      ],
      [
        4,
        3,
        1,
        3,
        3,
        3
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Chasm Crossing",
    "phase": "The Chasm I",
    "w": 6,
    "h": 6,
    "start": [
      5,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        3,
        3,
        1,
        0
      ],
      [
        4,
        4,
        1,
        1,
        1,
        0
      ],
      [
        3,
        2,
        0,
        3,
        1,
        3
      ],
      [
        4,
        3,
        3,
        1,
        0,
        3
      ],
      [
        5,
        0,
        3,
        1,
        1,
        0
      ],
      [
        1,
        4,
        1,
        2,
        3,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Archipelago",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      0,
      0
    ],
    "goal": [
      5,
      5
    ],
    "grid": [
      [
        5,
        0,
        3,
        1,
        5,
        4
      ],
      [
        3,
        1,
        1,
        3,
        5,
        3
      ],
      [
        1,
        1,
        4,
        0,
        5,
        2
      ],
      [
        2,
        2,
        4,
        0,
        4,
        0
      ],
      [
        3,
        3,
        1,
        0,
        4,
        4
      ],
      [
        0,
        0,
        3,
        5,
        1,
        1
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Deep Abyss",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      5,
      0
    ],
    "goal": [
      0,
      5
    ],
    "grid": [
      [
        3,
        4,
        0,
        5,
        1,
        1
      ],
      [
        2,
        0,
        1,
        5,
        1,
        0
      ],
      [
        5,
        4,
        5,
        0,
        2,
        3
      ],
      [
        4,
        4,
        1,
        5,
        1,
        2
      ],
      [
        3,
        4,
        4,
        5,
        1,
        0
      ],
      [
        1,
        4,
        1,
        5,
        5,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Precision Leap",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      3,
      3
    ],
    "goal": [
      5,
      0
    ],
    "grid": [
      [
        4,
        1,
        0,
        5,
        3,
        5
      ],
      [
        2,
        5,
        3,
        0,
        4,
        4
      ],
      [
        4,
        2,
        4,
        5,
        4,
        1
      ],
      [
        1,
        3,
        1,
        1,
        1,
        4
      ],
      [
        1,
        0,
        0,
        2,
        0,
        2
      ],
      [
        1,
        5,
        5,
        5,
        0,
        3
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Void Maze",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      0,
      5
    ],
    "goal": [
      5,
      0
    ],
    "grid": [
      [
        3,
        2,
        1,
        1,
        3,
        4
      ],
      [
        3,
        3,
        2,
        2,
        0,
        3
      ],
      [
        5,
        1,
        4,
        5,
        2,
        5
      ],
      [
        5,
        5,
        2,
        4,
        2,
        1
      ],
      [
        4,
        0,
        4,
        2,
        5,
        2
      ],
      [
        1,
        0,
        3,
        4,
        2,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Broken Causeway",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      0,
      0
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        1,
        4,
        2,
        1,
        0,
        4
      ],
      [
        0,
        1,
        2,
        2,
        5,
        2
      ],
      [
        0,
        1,
        1,
        5,
        4,
        3
      ],
      [
        4,
        3,
        1,
        1,
        5,
        0
      ],
      [
        0,
        1,
        4,
        5,
        1,
        5
      ],
      [
        5,
        0,
        1,
        4,
        2,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Stepping Stones",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      3,
      0
    ],
    "goal": [
      3,
      5
    ],
    "grid": [
      [
        2,
        1,
        1,
        4,
        4,
        0
      ],
      [
        4,
        3,
        2,
        3,
        4,
        3
      ],
      [
        0,
        4,
        5,
        2,
        1,
        4
      ],
      [
        1,
        3,
        1,
        3,
        0,
        1
      ],
      [
        4,
        1,
        1,
        5,
        4,
        4
      ],
      [
        3,
        3,
        0,
        4,
        1,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "The Outer Rift",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      5,
      5
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        0,
        1,
        2,
        0,
        5
      ],
      [
        2,
        2,
        4,
        0,
        5,
        0
      ],
      [
        3,
        5,
        5,
        5,
        5,
        3
      ],
      [
        1,
        4,
        2,
        1,
        2,
        2
      ],
      [
        0,
        1,
        1,
        2,
        2,
        4
      ],
      [
        1,
        2,
        4,
        0,
        3,
        4
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Dual Shores",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      0,
      3
    ],
    "goal": [
      5,
      3
    ],
    "grid": [
      [
        0,
        3,
        2,
        1,
        0,
        5
      ],
      [
        0,
        0,
        2,
        1,
        2,
        2
      ],
      [
        2,
        0,
        3,
        0,
        4,
        5
      ],
      [
        1,
        3,
        5,
        5,
        1,
        2
      ],
      [
        1,
        2,
        4,
        1,
        2,
        3
      ],
      [
        5,
        0,
        5,
        1,
        3,
        0
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Void Labyrinth",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      5,
      3
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        1,
        4,
        1,
        5,
        1,
        3
      ],
      [
        5,
        2,
        4,
        4,
        1,
        3
      ],
      [
        2,
        3,
        1,
        0,
        2,
        2
      ],
      [
        1,
        3,
        3,
        1,
        4,
        3
      ],
      [
        5,
        0,
        4,
        1,
        1,
        5
      ],
      [
        2,
        4,
        1,
        3,
        3,
        1
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Chasm Apex",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      5,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        2,
        1,
        1,
        4,
        2
      ],
      [
        3,
        0,
        1,
        3,
        5,
        3
      ],
      [
        3,
        4,
        2,
        2,
        2,
        2
      ],
      [
        0,
        1,
        5,
        0,
        0,
        2
      ],
      [
        5,
        3,
        3,
        3,
        5,
        3
      ],
      [
        4,
        4,
        2,
        2,
        4,
        0
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Labyrinth Entry",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      0,
      0
    ],
    "goal": [
      5,
      5
    ],
    "grid": [
      [
        3,
        1,
        4,
        2,
        4,
        2
      ],
      [
        3,
        5,
        1,
        3,
        2,
        3
      ],
      [
        4,
        2,
        2,
        3,
        3,
        2
      ],
      [
        1,
        4,
        3,
        5,
        5,
        3
      ],
      [
        5,
        3,
        2,
        1,
        5,
        2
      ],
      [
        3,
        2,
        3,
        3,
        2,
        1
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Dense Grid",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      5,
      0
    ],
    "goal": [
      0,
      5
    ],
    "grid": [
      [
        3,
        1,
        4,
        4,
        1,
        1
      ],
      [
        2,
        1,
        1,
        3,
        4,
        5
      ],
      [
        1,
        2,
        3,
        5,
        4,
        2
      ],
      [
        1,
        1,
        4,
        5,
        5,
        5
      ],
      [
        5,
        4,
        5,
        3,
        3,
        3
      ],
      [
        3,
        5,
        1,
        4,
        5,
        1
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Geometric Lock",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      3,
      3
    ],
    "goal": [
      5,
      0
    ],
    "grid": [
      [
        3,
        3,
        3,
        5,
        2,
        2
      ],
      [
        1,
        2,
        4,
        2,
        5,
        5
      ],
      [
        3,
        4,
        5,
        5,
        4,
        4
      ],
      [
        2,
        5,
        5,
        1,
        5,
        5
      ],
      [
        2,
        1,
        4,
        1,
        5,
        3
      ],
      [
        1,
        2,
        3,
        2,
        1,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "The Long Turn",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      0,
      5
    ],
    "goal": [
      5,
      0
    ],
    "grid": [
      [
        1,
        1,
        5,
        4,
        4,
        5
      ],
      [
        2,
        3,
        3,
        2,
        5,
        5
      ],
      [
        3,
        2,
        4,
        3,
        4,
        3
      ],
      [
        3,
        2,
        3,
        3,
        4,
        5
      ],
      [
        2,
        2,
        3,
        2,
        1,
        1
      ],
      [
        1,
        5,
        5,
        5,
        4,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Tangled Lines",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      0,
      0
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        3,
        2,
        5,
        5,
        3,
        5
      ],
      [
        4,
        1,
        2,
        4,
        2,
        3
      ],
      [
        5,
        2,
        5,
        1,
        3,
        2
      ],
      [
        2,
        1,
        5,
        1,
        4,
        4
      ],
      [
        4,
        5,
        2,
        4,
        4,
        1
      ],
      [
        1,
        5,
        4,
        5,
        3,
        3
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Outer Bounds",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      3,
      0
    ],
    "goal": [
      3,
      5
    ],
    "grid": [
      [
        5,
        4,
        2,
        2,
        5,
        2
      ],
      [
        5,
        3,
        3,
        1,
        4,
        2
      ],
      [
        1,
        1,
        2,
        2,
        1,
        2
      ],
      [
        4,
        5,
        4,
        3,
        3,
        1
      ],
      [
        5,
        3,
        3,
        2,
        2,
        1
      ],
      [
        2,
        2,
        3,
        4,
        4,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Inner Nexus",
    "phase": "Labyrinth I",
    "w": 7,
    "h": 7,
    "start": [
      6,
      6
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        5,
        5,
        1,
        2,
        3
      ],
      [
        4,
        3,
        2,
        2,
        3,
        4,
        1
      ],
      [
        1,
        5,
        5,
        3,
        5,
        4,
        1
      ],
      [
        2,
        2,
        2,
        4,
        3,
        1,
        2
      ],
      [
        4,
        4,
        4,
        3,
        2,
        2,
        3
      ],
      [
        3,
        3,
        5,
        1,
        2,
        5,
        4
      ],
      [
        4,
        2,
        4,
        1,
        4,
        1,
        4
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Threaded Leaps",
    "phase": "Labyrinth I",
    "w": 7,
    "h": 7,
    "start": [
      0,
      3
    ],
    "goal": [
      6,
      3
    ],
    "grid": [
      [
        2,
        3,
        4,
        5,
        4,
        2,
        2
      ],
      [
        4,
        2,
        5,
        3,
        2,
        1,
        4
      ],
      [
        2,
        1,
        1,
        3,
        2,
        3,
        1
      ],
      [
        2,
        1,
        4,
        1,
        3,
        1,
        2
      ],
      [
        5,
        1,
        5,
        5,
        5,
        1,
        1
      ],
      [
        3,
        1,
        5,
        3,
        4,
        3,
        3
      ],
      [
        5,
        3,
        2,
        1,
        2,
        3,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "The False 5",
    "phase": "Labyrinth I",
    "w": 7,
    "h": 7,
    "start": [
      6,
      3
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        5,
        4,
        1,
        4,
        1,
        2,
        2
      ],
      [
        5,
        1,
        3,
        4,
        1,
        5,
        2
      ],
      [
        2,
        4,
        2,
        5,
        3,
        5,
        4
      ],
      [
        1,
        5,
        5,
        1,
        5,
        2,
        4
      ],
      [
        4,
        5,
        2,
        2,
        4,
        4,
        5
      ],
      [
        5,
        2,
        2,
        4,
        4,
        2,
        4
      ],
      [
        2,
        3,
        3,
        1,
        5,
        5,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Labyrinth Core",
    "phase": "Labyrinth I",
    "w": 7,
    "h": 7,
    "start": [
      6,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        2,
        2,
        1,
        3,
        2,
        3
      ],
      [
        4,
        2,
        1,
        3,
        5,
        5,
        1
      ],
      [
        1,
        4,
        2,
        3,
        5,
        2,
        2
      ],
      [
        5,
        2,
        5,
        4,
        3,
        4,
        4
      ],
      [
        2,
        4,
        3,
        1,
        2,
        4,
        1
      ],
      [
        2,
        1,
        2,
        3,
        4,
        2,
        4
      ],
      [
        5,
        4,
        1,
        3,
        4,
        3,
        2
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Seven Seas",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      0,
      0
    ],
    "goal": [
      6,
      6
    ],
    "grid": [
      [
        5,
        4,
        1,
        1,
        4,
        2,
        3
      ],
      [
        1,
        3,
        3,
        4,
        5,
        4,
        1
      ],
      [
        1,
        2,
        2,
        1,
        4,
        5,
        1
      ],
      [
        2,
        4,
        2,
        2,
        1,
        4,
        5
      ],
      [
        4,
        2,
        4,
        1,
        3,
        1,
        1
      ],
      [
        5,
        3,
        2,
        5,
        5,
        4,
        4
      ],
      [
        1,
        2,
        5,
        3,
        1,
        2,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Expansive Field",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      6,
      0
    ],
    "goal": [
      0,
      6
    ],
    "grid": [
      [
        2,
        2,
        5,
        3,
        5,
        4,
        1
      ],
      [
        1,
        4,
        3,
        2,
        5,
        5,
        4
      ],
      [
        1,
        5,
        4,
        4,
        5,
        4,
        3
      ],
      [
        5,
        4,
        1,
        2,
        1,
        1,
        5
      ],
      [
        3,
        1,
        4,
        4,
        3,
        5,
        3
      ],
      [
        2,
        2,
        4,
        4,
        2,
        1,
        1
      ],
      [
        3,
        5,
        2,
        3,
        3,
        5,
        3
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Deep Threading",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      3,
      3
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        1,
        4,
        2,
        5,
        1,
        4,
        4
      ],
      [
        2,
        2,
        4,
        2,
        3,
        1,
        4
      ],
      [
        1,
        2,
        2,
        2,
        3,
        2,
        3
      ],
      [
        2,
        4,
        1,
        3,
        3,
        5,
        1
      ],
      [
        4,
        3,
        1,
        1,
        1,
        3,
        4
      ],
      [
        2,
        4,
        4,
        2,
        2,
        2,
        3
      ],
      [
        1,
        1,
        3,
        4,
        3,
        1,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Perimeter Walk",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      0,
      6
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        1,
        3,
        1,
        3,
        5,
        4,
        1
      ],
      [
        3,
        2,
        1,
        1,
        1,
        2,
        5
      ],
      [
        1,
        2,
        5,
        2,
        1,
        4,
        5
      ],
      [
        5,
        4,
        4,
        1,
        4,
        2,
        1
      ],
      [
        2,
        2,
        5,
        4,
        1,
        4,
        2
      ],
      [
        3,
        4,
        4,
        4,
        3,
        3,
        3
      ],
      [
        1,
        4,
        4,
        5,
        4,
        3,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "The Wide Sweep",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      0,
      0
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        5,
        2,
        2,
        2,
        4,
        4,
        2
      ],
      [
        5,
        4,
        4,
        1,
        5,
        5,
        3
      ],
      [
        3,
        2,
        1,
        2,
        5,
        1,
        4
      ],
      [
        4,
        3,
        5,
        1,
        3,
        5,
        3
      ],
      [
        2,
        1,
        3,
        2,
        4,
        3,
        1
      ],
      [
        5,
        1,
        1,
        5,
        4,
        5,
        2
      ],
      [
        1,
        1,
        4,
        1,
        5,
        2,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "High Stakes",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      3,
      0
    ],
    "goal": [
      3,
      6
    ],
    "grid": [
      [
        5,
        3,
        2,
        2,
        3,
        3,
        5
      ],
      [
        2,
        1,
        2,
        2,
        4,
        1,
        1
      ],
      [
        2,
        4,
        5,
        2,
        5,
        2,
        5
      ],
      [
        1,
        3,
        4,
        5,
        1,
        4,
        1
      ],
      [
        5,
        5,
        1,
        5,
        1,
        2,
        5
      ],
      [
        5,
        1,
        5,
        4,
        4,
        2,
        1
      ],
      [
        5,
        2,
        4,
        3,
        5,
        5,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Centrifugal",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      6,
      6
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        2,
        1,
        1,
        4,
        2
      ],
      [
        5,
        4,
        4,
        3,
        4,
        2,
        5
      ],
      [
        1,
        5,
        5,
        3,
        1,
        1,
        3
      ],
      [
        4,
        3,
        1,
        3,
        2,
        4,
        3
      ],
      [
        3,
        5,
        4,
        2,
        4,
        5,
        2
      ],
      [
        3,
        4,
        4,
        3,
        4,
        3,
        1
      ],
      [
        1,
        2,
        5,
        2,
        1,
        1,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Silent Trap",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      0,
      3
    ],
    "goal": [
      6,
      3
    ],
    "grid": [
      [
        1,
        1,
        1,
        1,
        5,
        4,
        4
      ],
      [
        4,
        6,
        2,
        4,
        1,
        1,
        6
      ],
      [
        1,
        1,
        4,
        1,
        6,
        2,
        3
      ],
      [
        5,
        4,
        1,
        2,
        5,
        5,
        5
      ],
      [
        6,
        4,
        6,
        1,
        1,
        6,
        3
      ],
      [
        2,
        4,
        3,
        2,
        3,
        6,
        6
      ],
      [
        3,
        4,
        4,
        1,
        2,
        2,
        5
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Long Range",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      6,
      3
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        4,
        1,
        6,
        5,
        6,
        6,
        6
      ],
      [
        6,
        2,
        6,
        1,
        1,
        1,
        4
      ],
      [
        4,
        6,
        6,
        3,
        5,
        5,
        5
      ],
      [
        2,
        4,
        1,
        1,
        6,
        2,
        2
      ],
      [
        4,
        5,
        4,
        4,
        6,
        1,
        3
      ],
      [
        4,
        6,
        5,
        4,
        1,
        1,
        4
      ],
      [
        1,
        2,
        4,
        4,
        3,
        3,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Labyrinth Apex",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      6,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        3,
        2,
        1,
        5,
        1,
        3
      ],
      [
        3,
        6,
        3,
        4,
        4,
        2,
        6
      ],
      [
        5,
        3,
        1,
        6,
        3,
        6,
        6
      ],
      [
        2,
        6,
        5,
        5,
        1,
        5,
        1
      ],
      [
        5,
        6,
        4,
        4,
        2,
        2,
        4
      ],
      [
        2,
        6,
        2,
        3,
        5,
        2,
        3
      ],
      [
        1,
        6,
        6,
        4,
        6,
        2,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Citadel Gates",
    "phase": "The Citadel",
    "w": 7,
    "h": 7,
    "start": [
      0,
      0
    ],
    "goal": [
      6,
      6
    ],
    "grid": [
      [
        6,
        4,
        3,
        3,
        4,
        2,
        2
      ],
      [
        3,
        5,
        1,
        3,
        3,
        5,
        5
      ],
      [
        2,
        4,
        3,
        4,
        6,
        2,
        3
      ],
      [
        3,
        2,
        1,
        4,
        3,
        3,
        5
      ],
      [
        4,
        4,
        6,
        6,
        1,
        2,
        1
      ],
      [
        5,
        4,
        3,
        3,
        5,
        3,
        3
      ],
      [
        2,
        4,
        2,
        1,
        6,
        3,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Outer Wall",
    "phase": "The Citadel",
    "w": 7,
    "h": 7,
    "start": [
      6,
      0
    ],
    "goal": [
      0,
      6
    ],
    "grid": [
      [
        3,
        1,
        2,
        6,
        2,
        6,
        1
      ],
      [
        1,
        1,
        1,
        3,
        4,
        3,
        1
      ],
      [
        3,
        2,
        5,
        5,
        6,
        6,
        5
      ],
      [
        6,
        6,
        3,
        3,
        3,
        1,
        6
      ],
      [
        6,
        2,
        6,
        5,
        3,
        4,
        1
      ],
      [
        6,
        5,
        6,
        3,
        2,
        2,
        4
      ],
      [
        3,
        2,
        3,
        2,
        3,
        2,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Bastion Step",
    "phase": "The Citadel",
    "w": 7,
    "h": 7,
    "start": [
      3,
      3
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        5,
        2,
        6,
        1,
        6,
        3,
        2
      ],
      [
        6,
        1,
        5,
        3,
        5,
        5,
        1
      ],
      [
        5,
        5,
        1,
        5,
        4,
        4,
        5
      ],
      [
        3,
        4,
        6,
        2,
        4,
        4,
        1
      ],
      [
        6,
        4,
        2,
        6,
        4,
        4,
        2
      ],
      [
        6,
        5,
        4,
        4,
        3,
        1,
        5
      ],
      [
        1,
        5,
        1,
        2,
        3,
        1,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Inner Keep",
    "phase": "The Citadel",
    "w": 7,
    "h": 7,
    "start": [
      0,
      6
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        3,
        5,
        3,
        1,
        4,
        2,
        5
      ],
      [
        4,
        5,
        1,
        2,
        4,
        2,
        1
      ],
      [
        5,
        3,
        5,
        5,
        1,
        6,
        1
      ],
      [
        2,
        6,
        2,
        5,
        4,
        6,
        6
      ],
      [
        2,
        2,
        6,
        2,
        4,
        1,
        1
      ],
      [
        6,
        1,
        3,
        3,
        6,
        6,
        6
      ],
      [
        1,
        3,
        6,
        2,
        1,
        1,
        4
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Watchtower",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      0,
      0
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        5,
        6,
        5,
        2,
        1,
        6,
        6,
        3
      ],
      [
        1,
        1,
        5,
        1,
        1,
        1,
        1,
        1
      ],
      [
        2,
        3,
        2,
        4,
        5,
        4,
        2,
        2
      ],
      [
        1,
        3,
        2,
        5,
        6,
        1,
        1,
        5
      ],
      [
        5,
        4,
        2,
        3,
        1,
        6,
        6,
        1
      ],
      [
        6,
        6,
        2,
        3,
        3,
        6,
        5,
        5
      ],
      [
        5,
        5,
        4,
        5,
        3,
        6,
        4,
        4
      ],
      [
        4,
        1,
        4,
        5,
        3,
        3,
        6,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Stone Lattice",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      4,
      0
    ],
    "goal": [
      4,
      7
    ],
    "grid": [
      [
        5,
        6,
        6,
        4,
        6,
        2,
        1,
        6
      ],
      [
        1,
        6,
        5,
        5,
        2,
        3,
        5,
        1
      ],
      [
        4,
        6,
        1,
        1,
        1,
        5,
        1,
        5
      ],
      [
        1,
        4,
        4,
        3,
        2,
        2,
        1,
        2
      ],
      [
        1,
        5,
        5,
        1,
        2,
        5,
        5,
        1
      ],
      [
        2,
        1,
        5,
        6,
        4,
        3,
        6,
        3
      ],
      [
        5,
        5,
        1,
        3,
        5,
        1,
        6,
        3
      ],
      [
        4,
        3,
        6,
        2,
        5,
        4,
        2,
        2
      ]
    ],
    "optimal": 8
  },
  {
    "name": "High Walk",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      7,
      7
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        3,
        6,
        1,
        4,
        2,
        3,
        4
      ],
      [
        5,
        1,
        3,
        6,
        1,
        1,
        2,
        4
      ],
      [
        3,
        1,
        3,
        5,
        5,
        1,
        4,
        3
      ],
      [
        6,
        6,
        3,
        4,
        6,
        6,
        4,
        2
      ],
      [
        2,
        1,
        2,
        2,
        5,
        5,
        3,
        2
      ],
      [
        2,
        6,
        1,
        6,
        1,
        3,
        6,
        3
      ],
      [
        5,
        5,
        4,
        5,
        3,
        3,
        5,
        3
      ],
      [
        2,
        4,
        1,
        4,
        5,
        3,
        6,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Courtyard",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      0,
      4
    ],
    "goal": [
      7,
      4
    ],
    "grid": [
      [
        3,
        2,
        5,
        5,
        2,
        6,
        2,
        6
      ],
      [
        4,
        3,
        2,
        5,
        5,
        2,
        3,
        6
      ],
      [
        4,
        4,
        4,
        6,
        3,
        3,
        5,
        6
      ],
      [
        5,
        6,
        3,
        5,
        4,
        3,
        3,
        6
      ],
      [
        1,
        4,
        5,
        4,
        6,
        4,
        2,
        1
      ],
      [
        3,
        2,
        6,
        3,
        3,
        2,
        2,
        4
      ],
      [
        1,
        4,
        5,
        5,
        3,
        5,
        1,
        4
      ],
      [
        3,
        5,
        1,
        5,
        1,
        5,
        4,
        5
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Fortress Loop",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      7,
      4
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        4,
        1,
        4,
        1,
        4,
        4,
        2,
        5
      ],
      [
        4,
        3,
        4,
        5,
        4,
        3,
        3,
        5
      ],
      [
        1,
        2,
        3,
        2,
        6,
        6,
        1,
        4
      ],
      [
        5,
        2,
        1,
        2,
        6,
        4,
        2,
        4
      ],
      [
        3,
        5,
        3,
        6,
        1,
        4,
        6,
        1
      ],
      [
        1,
        2,
        3,
        3,
        2,
        4,
        2,
        5
      ],
      [
        6,
        2,
        1,
        5,
        6,
        4,
        1,
        3
      ],
      [
        4,
        5,
        4,
        1,
        4,
        4,
        1,
        5
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Citadel Crown",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      7,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        6,
        4,
        2,
        5,
        3,
        4,
        2
      ],
      [
        6,
        2,
        4,
        3,
        6,
        1,
        5,
        6
      ],
      [
        2,
        4,
        2,
        6,
        4,
        6,
        3,
        1
      ],
      [
        1,
        2,
        5,
        4,
        2,
        4,
        2,
        3
      ],
      [
        3,
        3,
        6,
        4,
        2,
        3,
        5,
        5
      ],
      [
        2,
        4,
        4,
        5,
        3,
        2,
        1,
        3
      ],
      [
        2,
        1,
        3,
        2,
        2,
        5,
        3,
        5
      ],
      [
        1,
        6,
        4,
        2,
        2,
        5,
        5,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Master Opening",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      0,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        6,
        5,
        2,
        4,
        5,
        1,
        6,
        6
      ],
      [
        6,
        5,
        4,
        5,
        3,
        4,
        5,
        2
      ],
      [
        3,
        2,
        4,
        3,
        1,
        5,
        6,
        4
      ],
      [
        1,
        4,
        2,
        6,
        3,
        3,
        6,
        5
      ],
      [
        3,
        2,
        5,
        1,
        3,
        4,
        5,
        1
      ],
      [
        6,
        4,
        3,
        5,
        5,
        3,
        6,
        6
      ],
      [
        6,
        5,
        3,
        3,
        1,
        5,
        4,
        5
      ],
      [
        1,
        6,
        5,
        6,
        3,
        2,
        4,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Eight by Eight",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      7,
      0
    ],
    "goal": [
      0,
      7
    ],
    "grid": [
      [
        6,
        6,
        1,
        5,
        6,
        4,
        3,
        1
      ],
      [
        4,
        2,
        6,
        6,
        4,
        3,
        4,
        6
      ],
      [
        3,
        6,
        4,
        3,
        4,
        4,
        4,
        5
      ],
      [
        6,
        4,
        2,
        4,
        6,
        4,
        5,
        3
      ],
      [
        2,
        5,
        6,
        6,
        3,
        3,
        2,
        2
      ],
      [
        6,
        4,
        6,
        4,
        6,
        6,
        5,
        2
      ],
      [
        4,
        2,
        1,
        5,
        5,
        2,
        1,
        4
      ],
      [
        6,
        5,
        6,
        3,
        1,
        1,
        6,
        1
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Grand Traverse",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      4,
      4
    ],
    "goal": [
      7,
      0
    ],
    "grid": [
      [
        3,
        1,
        5,
        3,
        2,
        1,
        4,
        1
      ],
      [
        5,
        5,
        4,
        5,
        1,
        5,
        4,
        2
      ],
      [
        5,
        1,
        2,
        4,
        5,
        2,
        1,
        2
      ],
      [
        2,
        4,
        4,
        1,
        3,
        1,
        5,
        6
      ],
      [
        5,
        1,
        1,
        3,
        4,
        6,
        4,
        3
      ],
      [
        6,
        5,
        2,
        5,
        1,
        2,
        1,
        1
      ],
      [
        4,
        1,
        6,
        6,
        3,
        6,
        4,
        2
      ],
      [
        1,
        5,
        3,
        2,
        6,
        3,
        6,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "The Iron Maze",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      0,
      7
    ],
    "goal": [
      7,
      0
    ],
    "grid": [
      [
        4,
        5,
        3,
        3,
        1,
        1,
        2,
        5
      ],
      [
        4,
        1,
        5,
        2,
        5,
        6,
        5,
        1
      ],
      [
        4,
        4,
        3,
        6,
        4,
        6,
        3,
        2
      ],
      [
        6,
        2,
        1,
        6,
        1,
        4,
        6,
        3
      ],
      [
        5,
        3,
        4,
        3,
        5,
        1,
        3,
        2
      ],
      [
        4,
        5,
        5,
        5,
        5,
        6,
        6,
        2
      ],
      [
        6,
        2,
        6,
        6,
        4,
        2,
        6,
        2
      ],
      [
        1,
        1,
        2,
        5,
        6,
        6,
        2,
        3
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Calculated Leap",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      0,
      0
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        3,
        6,
        6,
        6,
        5,
        2,
        2,
        4
      ],
      [
        2,
        5,
        1,
        6,
        6,
        3,
        4,
        1
      ],
      [
        4,
        2,
        1,
        6,
        1,
        4,
        4,
        3
      ],
      [
        3,
        1,
        2,
        5,
        4,
        5,
        3,
        5
      ],
      [
        5,
        2,
        6,
        5,
        1,
        4,
        2,
        4
      ],
      [
        5,
        6,
        6,
        5,
        5,
        3,
        3,
        4
      ],
      [
        4,
        2,
        2,
        6,
        6,
        4,
        4,
        6
      ],
      [
        4,
        2,
        3,
        5,
        2,
        2,
        3,
        2
      ]
    ],
    "optimal": 9
  },
  {
    "name": "The Deep End",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      4,
      0
    ],
    "goal": [
      4,
      7
    ],
    "grid": [
      [
        4,
        3,
        4,
        1,
        1,
        4,
        4,
        6
      ],
      [
        2,
        6,
        6,
        3,
        4,
        5,
        5,
        1
      ],
      [
        5,
        4,
        1,
        2,
        1,
        6,
        4,
        2
      ],
      [
        5,
        4,
        1,
        1,
        5,
        1,
        4,
        6
      ],
      [
        5,
        5,
        6,
        3,
        5,
        1,
        6,
        1
      ],
      [
        6,
        1,
        6,
        5,
        1,
        6,
        4,
        4
      ],
      [
        5,
        3,
        6,
        5,
        3,
        2,
        5,
        2
      ],
      [
        1,
        3,
        6,
        6,
        3,
        5,
        3,
        1
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Infinite Eye",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      7,
      7
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        5,
        1,
        6,
        3,
        2,
        1,
        1
      ],
      [
        4,
        6,
        6,
        1,
        2,
        1,
        1,
        1
      ],
      [
        6,
        4,
        3,
        2,
        6,
        3,
        6,
        4
      ],
      [
        3,
        2,
        3,
        2,
        6,
        1,
        2,
        3
      ],
      [
        1,
        4,
        3,
        5,
        6,
        6,
        5,
        2
      ],
      [
        1,
        2,
        3,
        1,
        5,
        1,
        2,
        2
      ],
      [
        6,
        2,
        3,
        1,
        2,
        4,
        5,
        1
      ],
      [
        6,
        4,
        2,
        4,
        1,
        1,
        2,
        4
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Sovereign Path",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      0,
      4
    ],
    "goal": [
      7,
      4
    ],
    "grid": [
      [
        6,
        4,
        2,
        3,
        1,
        6,
        3,
        4
      ],
      [
        1,
        6,
        1,
        4,
        5,
        3,
        3,
        4
      ],
      [
        6,
        3,
        2,
        2,
        4,
        2,
        4,
        2
      ],
      [
        6,
        6,
        6,
        2,
        6,
        4,
        5,
        5
      ],
      [
        4,
        5,
        6,
        1,
        3,
        6,
        4,
        1
      ],
      [
        1,
        3,
        4,
        4,
        4,
        3,
        3,
        6
      ],
      [
        6,
        4,
        2,
        6,
        5,
        2,
        5,
        3
      ],
      [
        5,
        1,
        5,
        5,
        1,
        3,
        5,
        5
      ]
    ],
    "optimal": 10
  },
  {
    "name": "The Final Turn",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      7,
      4
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        3,
        6,
        2,
        6,
        6,
        2,
        5,
        5
      ],
      [
        6,
        2,
        1,
        1,
        3,
        5,
        4,
        1
      ],
      [
        3,
        5,
        3,
        5,
        5,
        6,
        4,
        1
      ],
      [
        3,
        5,
        5,
        5,
        3,
        5,
        6,
        6
      ],
      [
        6,
        2,
        2,
        4,
        1,
        1,
        3,
        6
      ],
      [
        6,
        5,
        6,
        1,
        3,
        6,
        6,
        1
      ],
      [
        5,
        1,
        6,
        3,
        4,
        6,
        3,
        2
      ],
      [
        1,
        3,
        5,
        5,
        2,
        5,
        1,
        2
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Grand Master Pinnacle",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      7,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        2,
        5,
        6,
        1,
        4,
        5,
        2
      ],
      [
        3,
        5,
        6,
        3,
        3,
        4,
        3,
        2
      ],
      [
        2,
        4,
        6,
        6,
        4,
        3,
        4,
        3
      ],
      [
        6,
        1,
        4,
        6,
        6,
        1,
        2,
        3
      ],
      [
        5,
        4,
        2,
        2,
        4,
        5,
        3,
        3
      ],
      [
        4,
        6,
        1,
        3,
        5,
        1,
        6,
        2
      ],
      [
        1,
        1,
        1,
        4,
        6,
        4,
        2,
        3
      ],
      [
        6,
        2,
        6,
        4,
        1,
        5,
        4,
        3
      ]
    ],
    "optimal": 11
  },
  {
    "name": "Singularity Point",
    "phase": "Singularity",
    "w": 6,
    "h": 6,
    "start": [
      3,
      0
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        3,
        4,
        2,
        3,
        2,
        5
      ],
      [
        2,
        3,
        3,
        1,
        3,
        4
      ],
      [
        1,
        3,
        2,
        1,
        3,
        1
      ],
      [
        1,
        4,
        1,
        1,
        3,
        2
      ],
      [
        5,
        4,
        4,
        2,
        0,
        4
      ],
      [
        1,
        5,
        5,
        4,
        4,
        1
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Gravitational Well",
    "phase": "Singularity",
    "w": 6,
    "h": 6,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        4,
        3,
        4,
        3,
        4
      ],
      [
        2,
        2,
        1,
        2,
        3,
        4
      ],
      [
        2,
        3,
        2,
        3,
        3,
        3
      ],
      [
        2,
        4,
        2,
        2,
        2,
        2
      ],
      [
        1,
        1,
        1,
        2,
        4,
        4
      ],
      [
        4,
        4,
        1,
        4,
        1,
        4
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Orbital Decay",
    "phase": "Singularity",
    "w": 6,
    "h": 6,
    "start": [
      3,
      0
    ],
    "goal": [
      5,
      0
    ],
    "grid": [
      [
        3,
        3,
        1,
        1,
        5,
        1
      ],
      [
        3,
        4,
        3,
        2,
        2,
        4
      ],
      [
        5,
        1,
        1,
        3,
        1,
        5
      ],
      [
        4,
        2,
        3,
        3,
        2,
        3
      ],
      [
        3,
        1,
        2,
        3,
        4,
        4
      ],
      [
        0,
        2,
        5,
        3,
        2,
        4
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Tidal Force",
    "phase": "Singularity",
    "w": 7,
    "h": 7,
    "start": [
      2,
      5
    ],
    "goal": [
      6,
      6
    ],
    "grid": [
      [
        5,
        6,
        5,
        3,
        1,
        3,
        4
      ],
      [
        6,
        1,
        2,
        1,
        4,
        3,
        3
      ],
      [
        4,
        4,
        3,
        2,
        4,
        3,
        5
      ],
      [
        4,
        1,
        2,
        1,
        3,
        4,
        4
      ],
      [
        4,
        5,
        1,
        3,
        4,
        1,
        1
      ],
      [
        6,
        3,
        3,
        3,
        2,
        4,
        5
      ],
      [
        5,
        1,
        2,
        2,
        1,
        1,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Spacetime Warp",
    "phase": "Singularity",
    "w": 7,
    "h": 7,
    "start": [
      2,
      5
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        3,
        3,
        2,
        3,
        6,
        1
      ],
      [
        2,
        2,
        3,
        4,
        2,
        4,
        5
      ],
      [
        6,
        5,
        4,
        1,
        2,
        5,
        2
      ],
      [
        1,
        3,
        4,
        2,
        4,
        4,
        5
      ],
      [
        1,
        3,
        4,
        2,
        2,
        2,
        6
      ],
      [
        1,
        1,
        1,
        1,
        5,
        3,
        2
      ],
      [
        6,
        2,
        2,
        3,
        6,
        2,
        4
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Event Boundary",
    "phase": "Singularity",
    "w": 7,
    "h": 7,
    "start": [
      6,
      2
    ],
    "goal": [
      1,
      5
    ],
    "grid": [
      [
        1,
        2,
        1,
        4,
        5,
        4,
        5
      ],
      [
        6,
        1,
        2,
        2,
        4,
        0,
        4
      ],
      [
        5,
        3,
        2,
        1,
        4,
        5,
        4
      ],
      [
        3,
        4,
        3,
        2,
        3,
        4,
        3
      ],
      [
        5,
        1,
        2,
        4,
        4,
        3,
        4
      ],
      [
        3,
        4,
        1,
        3,
        4,
        4,
        2
      ],
      [
        1,
        5,
        5,
        2,
        5,
        6,
        2
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Accretion Flow",
    "phase": "Singularity",
    "w": 7,
    "h": 7,
    "start": [
      5,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        1,
        3,
        5,
        4,
        2,
        6
      ],
      [
        2,
        1,
        3,
        5,
        4,
        4,
        5
      ],
      [
        5,
        1,
        3,
        4,
        3,
        4,
        6
      ],
      [
        5,
        5,
        3,
        3,
        4,
        1,
        1
      ],
      [
        6,
        1,
        2,
        1,
        3,
        3,
        6
      ],
      [
        2,
        5,
        5,
        2,
        1,
        5,
        1
      ],
      [
        5,
        4,
        2,
        4,
        3,
        3,
        5
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Schwarzschild Radius",
    "phase": "Singularity",
    "w": 7,
    "h": 7,
    "start": [
      1,
      0
    ],
    "goal": [
      5,
      1
    ],
    "grid": [
      [
        1,
        6,
        1,
        3,
        6,
        5,
        5
      ],
      [
        6,
        1,
        2,
        4,
        2,
        2,
        1
      ],
      [
        6,
        4,
        4,
        3,
        3,
        2,
        1
      ],
      [
        4,
        3,
        1,
        1,
        3,
        2,
        4
      ],
      [
        1,
        1,
        2,
        4,
        3,
        2,
        5
      ],
      [
        3,
        0,
        1,
        5,
        3,
        5,
        3
      ],
      [
        2,
        5,
        1,
        3,
        2,
        4,
        2
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Frame Dragging",
    "phase": "Singularity",
    "w": 7,
    "h": 7,
    "start": [
      1,
      4
    ],
    "goal": [
      1,
      1
    ],
    "grid": [
      [
        6,
        6,
        6,
        2,
        4,
        3,
        5
      ],
      [
        6,
        0,
        2,
        1,
        4,
        3,
        2
      ],
      [
        2,
        1,
        1,
        4,
        1,
        2,
        3
      ],
      [
        6,
        4,
        4,
        3,
        4,
        3,
        1
      ],
      [
        2,
        2,
        4,
        4,
        4,
        5,
        6
      ],
      [
        3,
        3,
        3,
        2,
        5,
        2,
        1
      ],
      [
        1,
        1,
        1,
        2,
        5,
        4,
        4
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Graviton Core",
    "phase": "Singularity",
    "w": 7,
    "h": 7,
    "start": [
      5,
      1
    ],
    "goal": [
      6,
      6
    ],
    "grid": [
      [
        2,
        3,
        3,
        1,
        3,
        1,
        1
      ],
      [
        4,
        3,
        4,
        3,
        3,
        3,
        1
      ],
      [
        1,
        3,
        4,
        4,
        2,
        3,
        6
      ],
      [
        6,
        2,
        2,
        1,
        1,
        4,
        3
      ],
      [
        6,
        4,
        1,
        3,
        1,
        3,
        4
      ],
      [
        5,
        4,
        1,
        3,
        5,
        2,
        6
      ],
      [
        1,
        6,
        3,
        6,
        1,
        5,
        0
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Superposition",
    "phase": "Quantum Leap",
    "w": 7,
    "h": 7,
    "start": [
      2,
      5
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        2,
        3,
        4,
        2,
        2,
        4,
        1
      ],
      [
        4,
        3,
        3,
        5,
        3,
        1,
        1
      ],
      [
        2,
        5,
        3,
        2,
        2,
        5,
        1
      ],
      [
        2,
        4,
        4,
        1,
        1,
        2,
        5
      ],
      [
        3,
        4,
        2,
        2,
        3,
        1,
        2
      ],
      [
        2,
        3,
        4,
        1,
        4,
        5,
        4
      ],
      [
        0,
        4,
        6,
        6,
        2,
        6,
        6
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Wave Collapse",
    "phase": "Quantum Leap",
    "w": 7,
    "h": 7,
    "start": [
      0,
      1
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        4,
        1,
        1,
        6,
        1,
        3
      ],
      [
        3,
        2,
        5,
        5,
        1,
        3,
        4
      ],
      [
        4,
        3,
        4,
        2,
        2,
        5,
        1
      ],
      [
        6,
        4,
        3,
        1,
        3,
        1,
        2
      ],
      [
        6,
        5,
        3,
        2,
        3,
        3,
        3
      ],
      [
        3,
        4,
        4,
        1,
        3,
        5,
        4
      ],
      [
        6,
        5,
        1,
        2,
        1,
        4,
        2
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Entanglement",
    "phase": "Quantum Leap",
    "w": 7,
    "h": 7,
    "start": [
      0,
      5
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        4,
        6,
        5,
        4,
        2,
        5,
        5
      ],
      [
        6,
        5,
        2,
        2,
        1,
        3,
        2
      ],
      [
        1,
        4,
        2,
        1,
        1,
        5,
        4
      ],
      [
        6,
        4,
        2,
        1,
        4,
        2,
        1
      ],
      [
        5,
        4,
        4,
        1,
        1,
        3,
        4
      ],
      [
        4,
        1,
        2,
        3,
        4,
        3,
        2
      ],
      [
        0,
        5,
        2,
        6,
        6,
        5,
        6
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Tunneling Vector",
    "phase": "Quantum Leap",
    "w": 7,
    "h": 7,
    "start": [
      0,
      1
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        6,
        4,
        2,
        4,
        6,
        6
      ],
      [
        4,
        1,
        2,
        5,
        4,
        4,
        2
      ],
      [
        4,
        2,
        4,
        2,
        1,
        5,
        6
      ],
      [
        2,
        4,
        4,
        2,
        4,
        5,
        4
      ],
      [
        5,
        3,
        1,
        2,
        4,
        4,
        3
      ],
      [
        1,
        5,
        4,
        4,
        1,
        3,
        6
      ],
      [
        5,
        5,
        3,
        3,
        1,
        5,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Planck Constant",
    "phase": "Quantum Leap",
    "w": 7,
    "h": 7,
    "start": [
      2,
      5
    ],
    "goal": [
      6,
      6
    ],
    "grid": [
      [
        2,
        2,
        2,
        6,
        1,
        4,
        6
      ],
      [
        4,
        3,
        2,
        3,
        5,
        3,
        6
      ],
      [
        2,
        3,
        3,
        4,
        1,
        2,
        4
      ],
      [
        4,
        2,
        1,
        1,
        1,
        3,
        5
      ],
      [
        5,
        2,
        2,
        4,
        2,
        2,
        4
      ],
      [
        1,
        1,
        3,
        4,
        1,
        3,
        1
      ],
      [
        5,
        4,
        2,
        5,
        4,
        4,
        0
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Schrodinger Path",
    "phase": "Quantum Leap",
    "w": 7,
    "h": 7,
    "start": [
      3,
      6
    ],
    "goal": [
      5,
      5
    ],
    "grid": [
      [
        6,
        1,
        3,
        4,
        5,
        4,
        4
      ],
      [
        3,
        2,
        4,
        5,
        4,
        3,
        5
      ],
      [
        5,
        3,
        1,
        1,
        1,
        4,
        1
      ],
      [
        3,
        1,
        3,
        3,
        4,
        4,
        4
      ],
      [
        1,
        3,
        2,
        2,
        4,
        3,
        1
      ],
      [
        3,
        1,
        5,
        3,
        4,
        0,
        6
      ],
      [
        4,
        6,
        1,
        1,
        5,
        1,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Quantum Decoherence",
    "phase": "Quantum Leap",
    "w": 7,
    "h": 7,
    "start": [
      5,
      6
    ],
    "goal": [
      5,
      1
    ],
    "grid": [
      [
        6,
        1,
        1,
        4,
        3,
        4,
        6
      ],
      [
        5,
        4,
        3,
        4,
        2,
        1,
        6
      ],
      [
        5,
        2,
        4,
        2,
        3,
        1,
        6
      ],
      [
        4,
        1,
        4,
        2,
        2,
        4,
        3
      ],
      [
        1,
        4,
        4,
        3,
        3,
        5,
        4
      ],
      [
        3,
        0,
        2,
        4,
        5,
        3,
        3
      ],
      [
        3,
        2,
        1,
        2,
        5,
        6,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Interference Pattern",
    "phase": "Quantum Leap",
    "w": 7,
    "h": 7,
    "start": [
      5,
      0
    ],
    "goal": [
      5,
      1
    ],
    "grid": [
      [
        4,
        1,
        1,
        3,
        5,
        2,
        6
      ],
      [
        6,
        5,
        4,
        5,
        2,
        3,
        5
      ],
      [
        5,
        1,
        4,
        3,
        3,
        4,
        2
      ],
      [
        6,
        2,
        3,
        3,
        2,
        5,
        3
      ],
      [
        1,
        4,
        2,
        2,
        1,
        2,
        4
      ],
      [
        4,
        0,
        5,
        3,
        2,
        4,
        2
      ],
      [
        1,
        2,
        1,
        1,
        2,
        6,
        2
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Phase Shift",
    "phase": "Quantum Leap",
    "w": 7,
    "h": 7,
    "start": [
      3,
      1
    ],
    "goal": [
      1,
      5
    ],
    "grid": [
      [
        1,
        4,
        3,
        1,
        4,
        2,
        1
      ],
      [
        4,
        5,
        1,
        4,
        2,
        0,
        1
      ],
      [
        1,
        4,
        4,
        2,
        1,
        4,
        2
      ],
      [
        4,
        3,
        2,
        2,
        4,
        5,
        6
      ],
      [
        3,
        4,
        4,
        3,
        4,
        1,
        1
      ],
      [
        5,
        1,
        2,
        3,
        2,
        2,
        3
      ],
      [
        3,
        6,
        4,
        1,
        6,
        6,
        4
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Zero-Point Flux",
    "phase": "Quantum Leap",
    "w": 7,
    "h": 7,
    "start": [
      2,
      5
    ],
    "goal": [
      6,
      6
    ],
    "grid": [
      [
        3,
        5,
        3,
        4,
        5,
        4,
        6
      ],
      [
        1,
        3,
        3,
        1,
        3,
        3,
        3
      ],
      [
        5,
        4,
        2,
        1,
        4,
        4,
        2
      ],
      [
        1,
        5,
        2,
        1,
        2,
        5,
        5
      ],
      [
        2,
        5,
        3,
        4,
        4,
        3,
        3
      ],
      [
        2,
        2,
        4,
        3,
        3,
        5,
        5
      ],
      [
        2,
        3,
        2,
        1,
        6,
        3,
        0
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Null Surface",
    "phase": "Event Horizon",
    "w": 7,
    "h": 7,
    "start": [
      2,
      6
    ],
    "goal": [
      6,
      6
    ],
    "grid": [
      [
        6,
        1,
        4,
        3,
        2,
        5,
        4
      ],
      [
        1,
        1,
        3,
        2,
        1,
        1,
        1
      ],
      [
        1,
        2,
        1,
        1,
        2,
        4,
        5
      ],
      [
        6,
        5,
        2,
        1,
        3,
        2,
        5
      ],
      [
        5,
        5,
        1,
        1,
        4,
        3,
        1
      ],
      [
        1,
        5,
        1,
        5,
        2,
        2,
        4
      ],
      [
        3,
        4,
        3,
        2,
        3,
        1,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Photon Sphere",
    "phase": "Event Horizon",
    "w": 7,
    "h": 7,
    "start": [
      1,
      6
    ],
    "goal": [
      1,
      1
    ],
    "grid": [
      [
        5,
        6,
        6,
        6,
        4,
        5,
        3
      ],
      [
        3,
        0,
        5,
        3,
        1,
        1,
        6
      ],
      [
        1,
        2,
        3,
        2,
        1,
        5,
        4
      ],
      [
        3,
        1,
        1,
        1,
        1,
        5,
        2
      ],
      [
        5,
        2,
        2,
        2,
        1,
        4,
        5
      ],
      [
        4,
        4,
        5,
        1,
        2,
        4,
        2
      ],
      [
        2,
        1,
        4,
        1,
        1,
        6,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Ergosphere",
    "phase": "Event Horizon",
    "w": 7,
    "h": 7,
    "start": [
      5,
      0
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        2,
        5,
        3,
        4,
        6,
        2,
        6
      ],
      [
        3,
        3,
        5,
        4,
        4,
        3,
        1
      ],
      [
        1,
        1,
        1,
        4,
        3,
        2,
        2
      ],
      [
        4,
        4,
        2,
        1,
        4,
        2,
        1
      ],
      [
        1,
        1,
        1,
        1,
        4,
        3,
        5
      ],
      [
        6,
        2,
        1,
        5,
        4,
        2,
        5
      ],
      [
        0,
        6,
        2,
        6,
        6,
        6,
        2
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Hawking Flux",
    "phase": "Event Horizon",
    "w": 7,
    "h": 7,
    "start": [
      4,
      1
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        5,
        6,
        6,
        4,
        4,
        4
      ],
      [
        4,
        4,
        1,
        3,
        4,
        5,
        4
      ],
      [
        4,
        3,
        1,
        4,
        3,
        3,
        2
      ],
      [
        4,
        2,
        3,
        2,
        1,
        3,
        5
      ],
      [
        1,
        5,
        4,
        4,
        2,
        5,
        1
      ],
      [
        3,
        5,
        2,
        1,
        2,
        4,
        3
      ],
      [
        5,
        2,
        2,
        5,
        6,
        6,
        1
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Gravitational Lens",
    "phase": "Event Horizon",
    "w": 7,
    "h": 7,
    "start": [
      5,
      3
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        5,
        6,
        6,
        1,
        3,
        4
      ],
      [
        3,
        4,
        3,
        5,
        5,
        4,
        4
      ],
      [
        2,
        3,
        3,
        4,
        1,
        5,
        1
      ],
      [
        6,
        4,
        1,
        2,
        1,
        1,
        6
      ],
      [
        6,
        3,
        3,
        4,
        1,
        1,
        6
      ],
      [
        5,
        5,
        5,
        5,
        3,
        3,
        2
      ],
      [
        3,
        4,
        3,
        1,
        6,
        2,
        4
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Point of No Return",
    "phase": "Event Horizon",
    "w": 7,
    "h": 7,
    "start": [
      6,
      5
    ],
    "goal": [
      5,
      1
    ],
    "grid": [
      [
        2,
        5,
        6,
        3,
        5,
        3,
        4
      ],
      [
        1,
        1,
        4,
        5,
        2,
        5,
        5
      ],
      [
        4,
        5,
        4,
        2,
        1,
        2,
        2
      ],
      [
        1,
        4,
        3,
        1,
        1,
        4,
        2
      ],
      [
        2,
        1,
        4,
        3,
        1,
        5,
        1
      ],
      [
        4,
        0,
        1,
        5,
        1,
        5,
        6
      ],
      [
        6,
        5,
        4,
        5,
        3,
        2,
        6
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Cosmic Censorship",
    "phase": "Event Horizon",
    "w": 7,
    "h": 7,
    "start": [
      3,
      0
    ],
    "goal": [
      1,
      1
    ],
    "grid": [
      [
        6,
        1,
        5,
        5,
        5,
        3,
        4
      ],
      [
        4,
        0,
        4,
        2,
        2,
        2,
        4
      ],
      [
        3,
        1,
        3,
        4,
        1,
        2,
        5
      ],
      [
        5,
        4,
        3,
        3,
        1,
        3,
        1
      ],
      [
        6,
        2,
        1,
        2,
        1,
        3,
        3
      ],
      [
        4,
        3,
        3,
        2,
        5,
        1,
        6
      ],
      [
        4,
        1,
        4,
        2,
        6,
        6,
        2
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Kerr Metric",
    "phase": "Event Horizon",
    "w": 7,
    "h": 7,
    "start": [
      5,
      0
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        5,
        4,
        5,
        2,
        4,
        2,
        1
      ],
      [
        5,
        5,
        4,
        2,
        4,
        4,
        4
      ],
      [
        3,
        5,
        1,
        2,
        3,
        5,
        3
      ],
      [
        4,
        2,
        4,
        1,
        4,
        3,
        1
      ],
      [
        6,
        2,
        1,
        4,
        1,
        2,
        6
      ],
      [
        2,
        3,
        4,
        3,
        4,
        2,
        3
      ],
      [
        0,
        1,
        4,
        6,
        3,
        4,
        2
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Chandra Limit",
    "phase": "Event Horizon",
    "w": 7,
    "h": 7,
    "start": [
      5,
      4
    ],
    "goal": [
      1,
      1
    ],
    "grid": [
      [
        2,
        5,
        6,
        2,
        1,
        5,
        3
      ],
      [
        6,
        0,
        5,
        5,
        2,
        1,
        3
      ],
      [
        2,
        5,
        1,
        3,
        1,
        4,
        2
      ],
      [
        4,
        2,
        2,
        1,
        4,
        1,
        5
      ],
      [
        4,
        5,
        2,
        4,
        4,
        1,
        6
      ],
      [
        2,
        3,
        3,
        5,
        4,
        5,
        6
      ],
      [
        5,
        3,
        5,
        6,
        6,
        6,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Singular Horizon",
    "phase": "Event Horizon",
    "w": 7,
    "h": 7,
    "start": [
      0,
      1
    ],
    "goal": [
      0,
      6
    ],
    "grid": [
      [
        1,
        1,
        1,
        1,
        3,
        4,
        0
      ],
      [
        6,
        1,
        3,
        1,
        3,
        2,
        4
      ],
      [
        2,
        1,
        2,
        4,
        1,
        4,
        2
      ],
      [
        4,
        5,
        4,
        3,
        4,
        2,
        5
      ],
      [
        4,
        3,
        1,
        4,
        3,
        5,
        6
      ],
      [
        6,
        5,
        5,
        1,
        1,
        1,
        4
      ],
      [
        6,
        1,
        5,
        2,
        1,
        3,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Tesseract",
    "phase": "Hypercube",
    "w": 7,
    "h": 7,
    "start": [
      2,
      6
    ],
    "goal": [
      0,
      6
    ],
    "grid": [
      [
        2,
        2,
        3,
        3,
        3,
        3,
        0
      ],
      [
        2,
        3,
        4,
        1,
        5,
        2,
        2
      ],
      [
        1,
        1,
        4,
        3,
        4,
        5,
        6
      ],
      [
        2,
        1,
        2,
        1,
        3,
        2,
        2
      ],
      [
        4,
        5,
        3,
        1,
        1,
        1,
        3
      ],
      [
        6,
        5,
        1,
        1,
        4,
        5,
        3
      ],
      [
        6,
        6,
        1,
        3,
        4,
        4,
        6
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Fourth Dimension",
    "phase": "Hypercube",
    "w": 7,
    "h": 7,
    "start": [
      0,
      2
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        1,
        3,
        4,
        5,
        4,
        3,
        3
      ],
      [
        5,
        5,
        2,
        1,
        3,
        4,
        2
      ],
      [
        5,
        1,
        2,
        2,
        1,
        3,
        1
      ],
      [
        2,
        5,
        1,
        2,
        1,
        3,
        2
      ],
      [
        5,
        5,
        2,
        1,
        2,
        3,
        3
      ],
      [
        2,
        4,
        1,
        5,
        4,
        3,
        3
      ],
      [
        0,
        1,
        4,
        3,
        6,
        6,
        1
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Orthogonal Fold",
    "phase": "Hypercube",
    "w": 7,
    "h": 7,
    "start": [
      0,
      5
    ],
    "goal": [
      1,
      5
    ],
    "grid": [
      [
        3,
        3,
        2,
        4,
        5,
        3,
        5
      ],
      [
        6,
        1,
        3,
        3,
        5,
        0,
        5
      ],
      [
        3,
        2,
        3,
        1,
        4,
        2,
        2
      ],
      [
        2,
        2,
        3,
        2,
        2,
        1,
        6
      ],
      [
        2,
        5,
        1,
        2,
        4,
        5,
        3
      ],
      [
        4,
        2,
        5,
        5,
        1,
        1,
        1
      ],
      [
        5,
        4,
        3,
        2,
        6,
        4,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Hyperplane",
    "phase": "Hypercube",
    "w": 8,
    "h": 8,
    "start": [
      2,
      5
    ],
    "goal": [
      0,
      7
    ],
    "grid": [
      [
        1,
        1,
        7,
        5,
        2,
        5,
        5,
        0
      ],
      [
        5,
        3,
        4,
        4,
        2,
        1,
        4,
        5
      ],
      [
        7,
        4,
        3,
        2,
        3,
        4,
        4,
        7
      ],
      [
        7,
        1,
        3,
        2,
        4,
        1,
        2,
        1
      ],
      [
        4,
        3,
        1,
        3,
        3,
        2,
        6,
        7
      ],
      [
        5,
        5,
        3,
        4,
        2,
        4,
        5,
        3
      ],
      [
        1,
        5,
        6,
        2,
        1,
        6,
        4,
        7
      ],
      [
        1,
        4,
        5,
        5,
        7,
        4,
        1,
        7
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Polytope",
    "phase": "Hypercube",
    "w": 8,
    "h": 8,
    "start": [
      0,
      7
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        5,
        7,
        2,
        5,
        2,
        7,
        3,
        2
      ],
      [
        7,
        3,
        1,
        4,
        5,
        4,
        2,
        6
      ],
      [
        2,
        3,
        1,
        5,
        4,
        5,
        1,
        6
      ],
      [
        2,
        2,
        1,
        4,
        3,
        2,
        5,
        6
      ],
      [
        2,
        3,
        1,
        4,
        1,
        3,
        6,
        4
      ],
      [
        6,
        1,
        4,
        5,
        5,
        4,
        5,
        3
      ],
      [
        7,
        6,
        5,
        6,
        4,
        6,
        4,
        3
      ],
      [
        2,
        4,
        3,
        4,
        3,
        7,
        5,
        0
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Simplex Leap",
    "phase": "Hypercube",
    "w": 8,
    "h": 8,
    "start": [
      7,
      3
    ],
    "goal": [
      1,
      1
    ],
    "grid": [
      [
        3,
        3,
        3,
        5,
        7,
        3,
        3,
        1
      ],
      [
        4,
        0,
        4,
        1,
        5,
        6,
        6,
        1
      ],
      [
        5,
        6,
        5,
        4,
        3,
        2,
        5,
        4
      ],
      [
        1,
        2,
        2,
        4,
        2,
        3,
        5,
        2
      ],
      [
        6,
        6,
        4,
        1,
        1,
        3,
        1,
        5
      ],
      [
        2,
        2,
        2,
        4,
        3,
        3,
        4,
        6
      ],
      [
        5,
        1,
        4,
        5,
        3,
        4,
        6,
        4
      ],
      [
        4,
        4,
        1,
        5,
        4,
        3,
        5,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Rotational Splay",
    "phase": "Hypercube",
    "w": 8,
    "h": 8,
    "start": [
      0,
      5
    ],
    "goal": [
      1,
      6
    ],
    "grid": [
      [
        6,
        6,
        1,
        5,
        6,
        6,
        6,
        4
      ],
      [
        6,
        3,
        1,
        1,
        6,
        3,
        0,
        7
      ],
      [
        4,
        6,
        3,
        2,
        2,
        5,
        1,
        1
      ],
      [
        5,
        4,
        1,
        2,
        1,
        1,
        1,
        1
      ],
      [
        1,
        2,
        2,
        1,
        2,
        5,
        3,
        2
      ],
      [
        7,
        2,
        3,
        4,
        1,
        5,
        6,
        6
      ],
      [
        7,
        3,
        5,
        5,
        5,
        5,
        4,
        7
      ],
      [
        7,
        5,
        3,
        7,
        1,
        6,
        2,
        5
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Shadow Projection",
    "phase": "Hypercube",
    "w": 8,
    "h": 8,
    "start": [
      7,
      5
    ],
    "goal": [
      1,
      6
    ],
    "grid": [
      [
        3,
        2,
        3,
        6,
        4,
        7,
        3,
        7
      ],
      [
        7,
        1,
        6,
        1,
        4,
        1,
        0,
        4
      ],
      [
        1,
        6,
        5,
        1,
        2,
        5,
        5,
        2
      ],
      [
        7,
        5,
        2,
        3,
        3,
        5,
        3,
        4
      ],
      [
        6,
        2,
        3,
        2,
        4,
        1,
        2,
        7
      ],
      [
        7,
        1,
        4,
        2,
        5,
        5,
        3,
        7
      ],
      [
        2,
        4,
        1,
        5,
        5,
        1,
        4,
        5
      ],
      [
        5,
        5,
        5,
        7,
        3,
        5,
        6,
        7
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Hypervolume",
    "phase": "Hypercube",
    "w": 8,
    "h": 8,
    "start": [
      4,
      1
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        6,
        1,
        5,
        1,
        5,
        6,
        4,
        7
      ],
      [
        2,
        2,
        4,
        3,
        3,
        2,
        4,
        1
      ],
      [
        1,
        3,
        3,
        4,
        6,
        7,
        4,
        2
      ],
      [
        1,
        6,
        2,
        2,
        1,
        1,
        3,
        1
      ],
      [
        4,
        3,
        2,
        5,
        7,
        6,
        7,
        2
      ],
      [
        5,
        6,
        5,
        1,
        6,
        5,
        7,
        3
      ],
      [
        6,
        4,
        2,
        7,
        3,
        4,
        5,
        6
      ],
      [
        1,
        2,
        5,
        3,
        3,
        1,
        7,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Dimensional Apex",
    "phase": "Hypercube",
    "w": 8,
    "h": 8,
    "start": [
      5,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        6,
        2,
        2,
        6,
        5,
        1,
        7,
        5
      ],
      [
        5,
        6,
        7,
        5,
        3,
        2,
        4,
        7
      ],
      [
        1,
        4,
        7,
        5,
        4,
        1,
        1,
        1
      ],
      [
        2,
        1,
        7,
        4,
        3,
        4,
        7,
        6
      ],
      [
        2,
        4,
        1,
        4,
        6,
        3,
        4,
        3
      ],
      [
        5,
        2,
        4,
        1,
        1,
        1,
        2,
        3
      ],
      [
        4,
        6,
        2,
        1,
        2,
        1,
        6,
        1
      ],
      [
        6,
        6,
        7,
        5,
        1,
        1,
        4,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Temporal Loop",
    "phase": "Chrono Loop",
    "w": 8,
    "h": 8,
    "start": [
      2,
      1
    ],
    "goal": [
      6,
      1
    ],
    "grid": [
      [
        5,
        1,
        5,
        6,
        5,
        2,
        3,
        2
      ],
      [
        2,
        4,
        5,
        6,
        3,
        5,
        5,
        2
      ],
      [
        3,
        5,
        3,
        4,
        2,
        2,
        2,
        1
      ],
      [
        1,
        3,
        3,
        4,
        4,
        1,
        1,
        3
      ],
      [
        1,
        2,
        3,
        1,
        2,
        2,
        1,
        5
      ],
      [
        1,
        4,
        2,
        5,
        4,
        1,
        4,
        3
      ],
      [
        3,
        0,
        4,
        3,
        4,
        6,
        6,
        7
      ],
      [
        2,
        7,
        6,
        7,
        5,
        5,
        4,
        1
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Closed Timelike Curve",
    "phase": "Chrono Loop",
    "w": 8,
    "h": 8,
    "start": [
      2,
      2
    ],
    "goal": [
      7,
      0
    ],
    "grid": [
      [
        3,
        6,
        6,
        6,
        7,
        1,
        5,
        3
      ],
      [
        6,
        1,
        4,
        5,
        6,
        6,
        2,
        2
      ],
      [
        6,
        5,
        3,
        3,
        1,
        2,
        3,
        2
      ],
      [
        3,
        4,
        5,
        4,
        1,
        4,
        5,
        7
      ],
      [
        4,
        6,
        5,
        1,
        3,
        3,
        6,
        1
      ],
      [
        3,
        2,
        3,
        2,
        5,
        2,
        1,
        4
      ],
      [
        5,
        5,
        3,
        5,
        6,
        3,
        4,
        3
      ],
      [
        0,
        6,
        6,
        5,
        1,
        3,
        7,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Retrocausality",
    "phase": "Chrono Loop",
    "w": 8,
    "h": 8,
    "start": [
      1,
      4
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        7,
        5,
        4,
        5,
        6,
        6,
        1
      ],
      [
        5,
        4,
        6,
        4,
        5,
        2,
        6,
        7
      ],
      [
        5,
        1,
        1,
        2,
        1,
        2,
        5,
        5
      ],
      [
        7,
        3,
        4,
        3,
        3,
        5,
        4,
        7
      ],
      [
        1,
        3,
        2,
        1,
        1,
        3,
        3,
        2
      ],
      [
        4,
        4,
        5,
        5,
        4,
        3,
        4,
        3
      ],
      [
        4,
        2,
        1,
        5,
        1,
        2,
        2,
        5
      ],
      [
        7,
        4,
        7,
        2,
        3,
        6,
        2,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Causal Echo",
    "phase": "Chrono Loop",
    "w": 8,
    "h": 8,
    "start": [
      5,
      2
    ],
    "goal": [
      1,
      1
    ],
    "grid": [
      [
        1,
        4,
        6,
        5,
        5,
        7,
        5,
        5
      ],
      [
        2,
        0,
        2,
        3,
        3,
        2,
        4,
        2
      ],
      [
        1,
        6,
        2,
        5,
        4,
        5,
        6,
        5
      ],
      [
        3,
        1,
        4,
        1,
        3,
        1,
        2,
        6
      ],
      [
        1,
        5,
        5,
        2,
        1,
        4,
        2,
        1
      ],
      [
        6,
        1,
        5,
        3,
        1,
        5,
        3,
        2
      ],
      [
        4,
        1,
        6,
        5,
        1,
        4,
        2,
        4
      ],
      [
        6,
        1,
        5,
        3,
        7,
        5,
        7,
        4
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Grandfather Paradox",
    "phase": "Chrono Loop",
    "w": 8,
    "h": 8,
    "start": [
      5,
      7
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        4,
        7,
        7,
        3,
        3,
        6,
        3
      ],
      [
        5,
        6,
        6,
        5,
        2,
        6,
        4,
        2
      ],
      [
        3,
        3,
        1,
        4,
        5,
        3,
        1,
        1
      ],
      [
        4,
        5,
        5,
        2,
        2,
        2,
        2,
        7
      ],
      [
        3,
        2,
        3,
        4,
        4,
        2,
        2,
        7
      ],
      [
        7,
        3,
        1,
        1,
        3,
        3,
        1,
        6
      ],
      [
        1,
        1,
        4,
        6,
        2,
        3,
        6,
        1
      ],
      [
        3,
        1,
        4,
        2,
        3,
        6,
        2,
        3
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Bootstrap Circuit",
    "phase": "Chrono Loop",
    "w": 8,
    "h": 8,
    "start": [
      7,
      6
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        2,
        7,
        2,
        6,
        1,
        1,
        1,
        6
      ],
      [
        2,
        4,
        3,
        1,
        6,
        2,
        6,
        7
      ],
      [
        4,
        2,
        1,
        2,
        1,
        4,
        3,
        4
      ],
      [
        1,
        6,
        5,
        1,
        1,
        1,
        5,
        6
      ],
      [
        5,
        5,
        2,
        1,
        1,
        5,
        5,
        5
      ],
      [
        4,
        6,
        2,
        1,
        4,
        4,
        1,
        7
      ],
      [
        4,
        1,
        2,
        1,
        5,
        4,
        4,
        4
      ],
      [
        6,
        7,
        2,
        4,
        2,
        3,
        6,
        0
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Time Dilation",
    "phase": "Chrono Loop",
    "w": 8,
    "h": 8,
    "start": [
      2,
      6
    ],
    "goal": [
      1,
      1
    ],
    "grid": [
      [
        6,
        7,
        4,
        2,
        4,
        7,
        1,
        4
      ],
      [
        7,
        0,
        5,
        4,
        1,
        5,
        6,
        2
      ],
      [
        7,
        6,
        2,
        3,
        2,
        3,
        4,
        6
      ],
      [
        4,
        2,
        2,
        1,
        1,
        1,
        6,
        1
      ],
      [
        6,
        4,
        3,
        1,
        2,
        2,
        3,
        6
      ],
      [
        5,
        5,
        1,
        4,
        4,
        2,
        6,
        7
      ],
      [
        2,
        5,
        6,
        5,
        5,
        2,
        4,
        2
      ],
      [
        3,
        1,
        7,
        6,
        1,
        7,
        6,
        2
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Chronosphere",
    "phase": "Chrono Loop",
    "w": 8,
    "h": 8,
    "start": [
      0,
      3
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        4,
        5,
        3,
        2,
        4,
        2,
        2,
        6
      ],
      [
        2,
        5,
        5,
        6,
        3,
        6,
        4,
        2
      ],
      [
        3,
        4,
        5,
        4,
        3,
        2,
        6,
        7
      ],
      [
        2,
        2,
        5,
        1,
        4,
        1,
        3,
        7
      ],
      [
        5,
        1,
        1,
        3,
        2,
        5,
        3,
        6
      ],
      [
        7,
        6,
        4,
        1,
        2,
        1,
        6,
        6
      ],
      [
        2,
        2,
        6,
        4,
        6,
        3,
        2,
        2
      ],
      [
        5,
        7,
        6,
        6,
        4,
        2,
        4,
        0
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Chrono Stasis",
    "phase": "Chrono Loop",
    "w": 8,
    "h": 8,
    "start": [
      3,
      4
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        5,
        6,
        7,
        3,
        6,
        5,
        1,
        2
      ],
      [
        7,
        5,
        3,
        2,
        4,
        1,
        5,
        7
      ],
      [
        4,
        1,
        5,
        7,
        4,
        5,
        4,
        3
      ],
      [
        4,
        3,
        3,
        3,
        2,
        4,
        2,
        4
      ],
      [
        2,
        1,
        6,
        5,
        3,
        4,
        4,
        1
      ],
      [
        3,
        5,
        4,
        4,
        6,
        4,
        6,
        1
      ],
      [
        2,
        4,
        6,
        5,
        3,
        4,
        2,
        5
      ],
      [
        7,
        1,
        3,
        7,
        1,
        3,
        4,
        0
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Eternal Return",
    "phase": "Chrono Loop",
    "w": 8,
    "h": 8,
    "start": [
      0,
      4
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        3,
        1,
        4,
        5,
        1,
        6,
        3
      ],
      [
        3,
        1,
        4,
        5,
        4,
        2,
        5,
        1
      ],
      [
        5,
        6,
        1,
        5,
        3,
        1,
        2,
        7
      ],
      [
        4,
        2,
        5,
        1,
        2,
        1,
        5,
        2
      ],
      [
        6,
        1,
        3,
        1,
        1,
        1,
        5,
        1
      ],
      [
        1,
        4,
        2,
        5,
        4,
        4,
        6,
        4
      ],
      [
        3,
        6,
        6,
        1,
        4,
        1,
        3,
        2
      ],
      [
        6,
        3,
        7,
        2,
        7,
        5,
        1,
        4
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Corona Burst",
    "phase": "Stellar Corona",
    "w": 8,
    "h": 8,
    "start": [
      7,
      5
    ],
    "goal": [
      1,
      6
    ],
    "grid": [
      [
        4,
        6,
        6,
        5,
        7,
        3,
        4,
        1
      ],
      [
        4,
        2,
        6,
        4,
        1,
        5,
        0,
        1
      ],
      [
        2,
        4,
        4,
        2,
        1,
        3,
        3,
        1
      ],
      [
        3,
        1,
        3,
        3,
        4,
        3,
        3,
        4
      ],
      [
        1,
        1,
        4,
        2,
        4,
        4,
        5,
        6
      ],
      [
        7,
        2,
        3,
        3,
        4,
        2,
        3,
        6
      ],
      [
        3,
        2,
        2,
        1,
        5,
        6,
        6,
        4
      ],
      [
        3,
        2,
        3,
        2,
        2,
        7,
        4,
        7
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Solar Wind",
    "phase": "Stellar Corona",
    "w": 8,
    "h": 8,
    "start": [
      1,
      2
    ],
    "goal": [
      1,
      1
    ],
    "grid": [
      [
        2,
        6,
        2,
        2,
        3,
        5,
        3,
        7
      ],
      [
        1,
        0,
        6,
        3,
        5,
        1,
        1,
        4
      ],
      [
        3,
        4,
        2,
        1,
        1,
        2,
        2,
        3
      ],
      [
        2,
        6,
        4,
        2,
        3,
        1,
        4,
        4
      ],
      [
        5,
        2,
        1,
        2,
        3,
        5,
        6,
        3
      ],
      [
        6,
        3,
        4,
        3,
        3,
        2,
        3,
        3
      ],
      [
        4,
        6,
        2,
        2,
        6,
        4,
        2,
        4
      ],
      [
        7,
        3,
        4,
        5,
        1,
        7,
        5,
        6
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Photosphere",
    "phase": "Stellar Corona",
    "w": 8,
    "h": 8,
    "start": [
      5,
      6
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        1,
        3,
        3,
        6,
        6,
        6,
        4,
        2
      ],
      [
        2,
        4,
        5,
        4,
        4,
        1,
        2,
        2
      ],
      [
        4,
        3,
        5,
        1,
        4,
        4,
        2,
        3
      ],
      [
        6,
        6,
        2,
        1,
        1,
        1,
        5,
        3
      ],
      [
        2,
        6,
        4,
        4,
        3,
        2,
        4,
        7
      ],
      [
        4,
        4,
        4,
        1,
        1,
        1,
        5,
        2
      ],
      [
        1,
        5,
        2,
        4,
        4,
        6,
        4,
        3
      ],
      [
        5,
        7,
        1,
        6,
        7,
        5,
        4,
        0
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Prominence Leap",
    "phase": "Stellar Corona",
    "w": 8,
    "h": 8,
    "start": [
      4,
      0
    ],
    "goal": [
      1,
      1
    ],
    "grid": [
      [
        6,
        3,
        7,
        3,
        2,
        6,
        2,
        3
      ],
      [
        1,
        0,
        6,
        1,
        1,
        1,
        4,
        3
      ],
      [
        6,
        5,
        4,
        2,
        1,
        5,
        1,
        4
      ],
      [
        4,
        5,
        1,
        2,
        2,
        4,
        5,
        7
      ],
      [
        1,
        5,
        4,
        2,
        1,
        2,
        1,
        6
      ],
      [
        5,
        2,
        3,
        3,
        2,
        3,
        6,
        3
      ],
      [
        7,
        5,
        3,
        4,
        5,
        5,
        1,
        5
      ],
      [
        3,
        1,
        3,
        7,
        5,
        3,
        3,
        4
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Magnetic Reconnection",
    "phase": "Stellar Corona",
    "w": 8,
    "h": 8,
    "start": [
      1,
      0
    ],
    "goal": [
      6,
      1
    ],
    "grid": [
      [
        3,
        5,
        2,
        6,
        2,
        4,
        5,
        7
      ],
      [
        6,
        6,
        6,
        3,
        5,
        2,
        6,
        3
      ],
      [
        1,
        3,
        1,
        4,
        1,
        3,
        3,
        2
      ],
      [
        3,
        4,
        3,
        2,
        3,
        4,
        6,
        1
      ],
      [
        2,
        1,
        3,
        2,
        4,
        2,
        1,
        2
      ],
      [
        3,
        1,
        2,
        3,
        5,
        3,
        1,
        1
      ],
      [
        5,
        0,
        6,
        1,
        6,
        6,
        3,
        3
      ],
      [
        7,
        4,
        7,
        7,
        1,
        6,
        2,
        1
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Chromosphere",
    "phase": "Stellar Corona",
    "w": 8,
    "h": 8,
    "start": [
      1,
      6
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        2,
        3,
        2,
        2,
        3,
        6,
        3,
        2
      ],
      [
        6,
        4,
        3,
        7,
        6,
        7,
        3,
        2
      ],
      [
        5,
        7,
        2,
        4,
        4,
        7,
        1,
        5
      ],
      [
        1,
        6,
        5,
        4,
        4,
        4,
        3,
        2
      ],
      [
        3,
        4,
        4,
        7,
        5,
        5,
        4,
        2
      ],
      [
        6,
        4,
        4,
        1,
        2,
        2,
        1,
        1
      ],
      [
        3,
        4,
        3,
        7,
        2,
        5,
        7,
        4
      ],
      [
        4,
        5,
        6,
        3,
        2,
        5,
        1,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Heliosphere",
    "phase": "Stellar Corona",
    "w": 8,
    "h": 8,
    "start": [
      4,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        5,
        2,
        5,
        5,
        2,
        4,
        2,
        1
      ],
      [
        4,
        2,
        7,
        4,
        3,
        6,
        6,
        1
      ],
      [
        6,
        3,
        3,
        7,
        7,
        2,
        3,
        1
      ],
      [
        6,
        2,
        4,
        4,
        1,
        4,
        2,
        6
      ],
      [
        7,
        7,
        1,
        6,
        7,
        2,
        6,
        5
      ],
      [
        4,
        4,
        7,
        2,
        5,
        2,
        6,
        2
      ],
      [
        3,
        2,
        6,
        4,
        7,
        6,
        3,
        4
      ],
      [
        5,
        7,
        1,
        7,
        6,
        2,
        3,
        0
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Coronal Mass Surge",
    "phase": "Stellar Corona",
    "w": 8,
    "h": 8,
    "start": [
      7,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        7,
        7,
        3,
        6,
        7,
        1,
        5,
        5
      ],
      [
        5,
        7,
        2,
        2,
        1,
        4,
        3,
        3
      ],
      [
        6,
        2,
        2,
        7,
        2,
        2,
        6,
        7
      ],
      [
        5,
        2,
        7,
        2,
        2,
        3,
        3,
        5
      ],
      [
        5,
        6,
        3,
        6,
        5,
        2,
        5,
        3
      ],
      [
        1,
        7,
        2,
        5,
        3,
        5,
        1,
        7
      ],
      [
        6,
        1,
        6,
        5,
        7,
        4,
        3,
        4
      ],
      [
        4,
        4,
        4,
        1,
        7,
        2,
        7,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Solar Flare",
    "phase": "Stellar Corona",
    "w": 8,
    "h": 8,
    "start": [
      6,
      6
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        6,
        5,
        1,
        7,
        6,
        7,
        6,
        6
      ],
      [
        7,
        1,
        4,
        3,
        4,
        2,
        3,
        6
      ],
      [
        7,
        6,
        4,
        7,
        5,
        1,
        1,
        2
      ],
      [
        1,
        2,
        3,
        1,
        3,
        1,
        5,
        6
      ],
      [
        1,
        7,
        7,
        4,
        2,
        2,
        1,
        4
      ],
      [
        4,
        6,
        4,
        7,
        2,
        3,
        4,
        7
      ],
      [
        4,
        5,
        6,
        7,
        2,
        4,
        2,
        2
      ],
      [
        5,
        4,
        1,
        1,
        2,
        1,
        3,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Stellar Zenith",
    "phase": "Stellar Corona",
    "w": 8,
    "h": 8,
    "start": [
      2,
      7
    ],
    "goal": [
      1,
      6
    ],
    "grid": [
      [
        2,
        7,
        6,
        4,
        3,
        6,
        5,
        3
      ],
      [
        1,
        6,
        6,
        1,
        4,
        6,
        0,
        3
      ],
      [
        5,
        4,
        5,
        1,
        4,
        5,
        6,
        7
      ],
      [
        4,
        1,
        2,
        3,
        2,
        1,
        6,
        4
      ],
      [
        1,
        4,
        5,
        2,
        4,
        2,
        4,
        3
      ],
      [
        1,
        1,
        1,
        4,
        2,
        1,
        1,
        4
      ],
      [
        1,
        2,
        2,
        4,
        1,
        2,
        5,
        2
      ],
      [
        1,
        1,
        7,
        2,
        1,
        5,
        2,
        1
      ]
    ],
    "optimal": 11
  },
  {
    "name": "WIMP Halo",
    "phase": "Dark Matter",
    "w": 8,
    "h": 8,
    "start": [
      7,
      3
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        2,
        4,
        5,
        7,
        3,
        7,
        6
      ],
      [
        3,
        6,
        1,
        1,
        3,
        3,
        4,
        3
      ],
      [
        4,
        4,
        2,
        1,
        1,
        2,
        5,
        6
      ],
      [
        1,
        6,
        5,
        2,
        1,
        4,
        1,
        7
      ],
      [
        5,
        3,
        2,
        3,
        3,
        4,
        1,
        1
      ],
      [
        5,
        1,
        5,
        4,
        3,
        2,
        2,
        4
      ],
      [
        7,
        4,
        5,
        3,
        5,
        3,
        3,
        3
      ],
      [
        6,
        1,
        1,
        1,
        3,
        3,
        2,
        4
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Cold Dark Matter",
    "phase": "Dark Matter",
    "w": 8,
    "h": 8,
    "start": [
      7,
      6
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        5,
        7,
        3,
        6,
        6,
        5,
        3,
        1
      ],
      [
        3,
        3,
        1,
        6,
        1,
        5,
        6,
        1
      ],
      [
        6,
        6,
        3,
        1,
        2,
        3,
        1,
        1
      ],
      [
        1,
        4,
        1,
        2,
        1,
        1,
        5,
        3
      ],
      [
        2,
        5,
        1,
        3,
        3,
        2,
        6,
        5
      ],
      [
        4,
        6,
        5,
        5,
        3,
        5,
        3,
        5
      ],
      [
        5,
        4,
        2,
        1,
        6,
        4,
        3,
        1
      ],
      [
        2,
        1,
        6,
        5,
        6,
        7,
        6,
        0
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Gravitational Veil",
    "phase": "Dark Matter",
    "w": 8,
    "h": 8,
    "start": [
      7,
      4
    ],
    "goal": [
      7,
      0
    ],
    "grid": [
      [
        2,
        5,
        5,
        4,
        4,
        5,
        1,
        1
      ],
      [
        2,
        1,
        1,
        1,
        3,
        1,
        4,
        4
      ],
      [
        4,
        2,
        4,
        2,
        5,
        3,
        6,
        5
      ],
      [
        5,
        3,
        1,
        1,
        2,
        3,
        3,
        1
      ],
      [
        1,
        3,
        5,
        1,
        1,
        3,
        3,
        4
      ],
      [
        6,
        5,
        3,
        2,
        2,
        3,
        6,
        2
      ],
      [
        7,
        2,
        1,
        2,
        5,
        1,
        3,
        5
      ],
      [
        0,
        1,
        6,
        1,
        7,
        2,
        5,
        5
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Baryon Acoustic Wave",
    "phase": "Dark Matter",
    "w": 8,
    "h": 8,
    "start": [
      7,
      4
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        5,
        2,
        3,
        2,
        4,
        4,
        1,
        1
      ],
      [
        5,
        1,
        1,
        3,
        1,
        5,
        3,
        3
      ],
      [
        4,
        3,
        4,
        1,
        1,
        3,
        1,
        1
      ],
      [
        6,
        6,
        2,
        4,
        2,
        3,
        3,
        6
      ],
      [
        6,
        4,
        2,
        3,
        3,
        1,
        5,
        7
      ],
      [
        5,
        1,
        3,
        5,
        5,
        4,
        6,
        2
      ],
      [
        7,
        1,
        4,
        1,
        2,
        3,
        2,
        1
      ],
      [
        3,
        3,
        7,
        1,
        2,
        5,
        3,
        0
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Axion Resonance",
    "phase": "Dark Matter",
    "w": 8,
    "h": 8,
    "start": [
      1,
      7
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        7,
        3,
        2,
        6,
        3,
        2,
        4,
        6
      ],
      [
        3,
        4,
        5,
        7,
        3,
        6,
        7,
        5
      ],
      [
        6,
        3,
        5,
        2,
        5,
        5,
        1,
        2
      ],
      [
        6,
        3,
        7,
        2,
        1,
        7,
        3,
        4
      ],
      [
        6,
        4,
        2,
        3,
        1,
        6,
        3,
        1
      ],
      [
        4,
        2,
        3,
        7,
        2,
        2,
        3,
        2
      ],
      [
        3,
        3,
        6,
        1,
        3,
        5,
        6,
        5
      ],
      [
        5,
        6,
        4,
        4,
        1,
        4,
        2,
        0
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Hidden Sector",
    "phase": "Dark Matter",
    "w": 8,
    "h": 8,
    "start": [
      7,
      1
    ],
    "goal": [
      1,
      1
    ],
    "grid": [
      [
        2,
        3,
        2,
        7,
        4,
        3,
        5,
        5
      ],
      [
        1,
        0,
        5,
        1,
        2,
        4,
        6,
        7
      ],
      [
        4,
        4,
        1,
        3,
        1,
        4,
        5,
        6
      ],
      [
        3,
        5,
        2,
        1,
        4,
        5,
        5,
        7
      ],
      [
        5,
        2,
        2,
        3,
        1,
        5,
        6,
        7
      ],
      [
        4,
        4,
        1,
        5,
        2,
        3,
        1,
        4
      ],
      [
        3,
        3,
        6,
        6,
        3,
        6,
        4,
        3
      ],
      [
        4,
        5,
        6,
        1,
        4,
        5,
        5,
        7
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Filament Lattice",
    "phase": "Dark Matter",
    "w": 8,
    "h": 8,
    "start": [
      5,
      3
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        2,
        2,
        2,
        6,
        7,
        2,
        3,
        6
      ],
      [
        1,
        2,
        6,
        1,
        2,
        4,
        1,
        3
      ],
      [
        5,
        4,
        5,
        5,
        4,
        1,
        4,
        4
      ],
      [
        5,
        3,
        3,
        4,
        3,
        2,
        3,
        5
      ],
      [
        7,
        3,
        1,
        2,
        3,
        3,
        3,
        1
      ],
      [
        5,
        4,
        4,
        5,
        4,
        2,
        5,
        6
      ],
      [
        7,
        6,
        6,
        4,
        1,
        6,
        2,
        5
      ],
      [
        3,
        6,
        3,
        6,
        2,
        7,
        6,
        0
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Dark Velocity",
    "phase": "Dark Matter",
    "w": 8,
    "h": 8,
    "start": [
      4,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        6,
        4,
        7,
        4,
        1,
        6,
        2,
        4
      ],
      [
        4,
        4,
        4,
        4,
        2,
        4,
        6,
        1
      ],
      [
        4,
        3,
        4,
        6,
        5,
        1,
        3,
        6
      ],
      [
        6,
        4,
        3,
        5,
        2,
        5,
        5,
        7
      ],
      [
        1,
        3,
        4,
        4,
        1,
        3,
        6,
        6
      ],
      [
        1,
        7,
        1,
        5,
        5,
        2,
        7,
        7
      ],
      [
        7,
        7,
        4,
        1,
        5,
        6,
        4,
        2
      ],
      [
        1,
        7,
        2,
        4,
        3,
        1,
        1,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Galactic Web",
    "phase": "Dark Matter",
    "w": 8,
    "h": 8,
    "start": [
      6,
      2
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        4,
        5,
        1,
        1,
        3,
        6,
        6,
        2
      ],
      [
        2,
        2,
        2,
        6,
        6,
        4,
        3,
        6
      ],
      [
        6,
        5,
        5,
        6,
        2,
        2,
        5,
        2
      ],
      [
        1,
        7,
        6,
        7,
        6,
        2,
        7,
        1
      ],
      [
        1,
        3,
        7,
        1,
        4,
        6,
        5,
        2
      ],
      [
        3,
        2,
        3,
        5,
        1,
        5,
        4,
        7
      ],
      [
        1,
        2,
        3,
        5,
        6,
        3,
        4,
        7
      ],
      [
        5,
        2,
        5,
        1,
        6,
        5,
        7,
        0
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Cosmic Shadow",
    "phase": "Dark Matter",
    "w": 8,
    "h": 8,
    "start": [
      7,
      5
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        1,
        3,
        4,
        6,
        6,
        1,
        5,
        4
      ],
      [
        6,
        3,
        7,
        7,
        2,
        7,
        1,
        3
      ],
      [
        2,
        6,
        1,
        5,
        2,
        6,
        3,
        4
      ],
      [
        1,
        3,
        4,
        4,
        4,
        1,
        2,
        1
      ],
      [
        2,
        5,
        1,
        4,
        3,
        2,
        6,
        7
      ],
      [
        3,
        7,
        1,
        3,
        5,
        5,
        7,
        5
      ],
      [
        5,
        1,
        7,
        4,
        3,
        7,
        6,
        2
      ],
      [
        7,
        7,
        2,
        3,
        1,
        4,
        2,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Laniakea",
    "phase": "Supercluster",
    "w": 8,
    "h": 8,
    "start": [
      5,
      1
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        7,
        6,
        7,
        2,
        2,
        1,
        7,
        6
      ],
      [
        7,
        1,
        6,
        5,
        3,
        1,
        2,
        7
      ],
      [
        6,
        1,
        2,
        3,
        3,
        5,
        4,
        6
      ],
      [
        7,
        3,
        1,
        4,
        4,
        5,
        2,
        7
      ],
      [
        4,
        1,
        3,
        1,
        4,
        2,
        4,
        3
      ],
      [
        4,
        6,
        5,
        4,
        5,
        3,
        6,
        4
      ],
      [
        6,
        1,
        6,
        2,
        1,
        4,
        3,
        6
      ],
      [
        5,
        4,
        6,
        2,
        4,
        3,
        3,
        0
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Great Attractor",
    "phase": "Supercluster",
    "w": 8,
    "h": 8,
    "start": [
      4,
      1
    ],
    "goal": [
      7,
      0
    ],
    "grid": [
      [
        7,
        4,
        3,
        3,
        6,
        7,
        1,
        2
      ],
      [
        7,
        5,
        6,
        6,
        3,
        3,
        5,
        7
      ],
      [
        7,
        6,
        4,
        3,
        3,
        5,
        3,
        1
      ],
      [
        2,
        2,
        4,
        2,
        3,
        2,
        5,
        3
      ],
      [
        1,
        5,
        2,
        1,
        2,
        2,
        4,
        6
      ],
      [
        3,
        5,
        2,
        2,
        2,
        5,
        6,
        7
      ],
      [
        4,
        4,
        4,
        3,
        3,
        1,
        1,
        3
      ],
      [
        0,
        7,
        7,
        7,
        1,
        1,
        1,
        5
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Virgo Supercluster",
    "phase": "Supercluster",
    "w": 8,
    "h": 8,
    "start": [
      7,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        5,
        7,
        4,
        2,
        4,
        3,
        5,
        7
      ],
      [
        5,
        3,
        5,
        1,
        5,
        7,
        3,
        6
      ],
      [
        7,
        3,
        3,
        5,
        4,
        1,
        7,
        3
      ],
      [
        2,
        5,
        6,
        7,
        5,
        5,
        3,
        4
      ],
      [
        7,
        6,
        6,
        7,
        1,
        4,
        1,
        1
      ],
      [
        1,
        1,
        5,
        2,
        1,
        2,
        7,
        6
      ],
      [
        1,
        4,
        5,
        1,
        2,
        2,
        5,
        2
      ],
      [
        6,
        1,
        2,
        1,
        6,
        1,
        2,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Cosmic Void",
    "phase": "Supercluster",
    "w": 8,
    "h": 8,
    "start": [
      2,
      3
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        1,
        1,
        1,
        5,
        1,
        6,
        6,
        1
      ],
      [
        4,
        6,
        2,
        3,
        1,
        2,
        5,
        3
      ],
      [
        2,
        5,
        7,
        4,
        7,
        7,
        2,
        1
      ],
      [
        1,
        4,
        2,
        6,
        3,
        2,
        6,
        5
      ],
      [
        7,
        3,
        5,
        5,
        6,
        7,
        1,
        6
      ],
      [
        1,
        1,
        7,
        7,
        2,
        4,
        4,
        7
      ],
      [
        1,
        1,
        2,
        4,
        6,
        2,
        2,
        5
      ],
      [
        3,
        7,
        7,
        2,
        7,
        2,
        6,
        0
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Perseus-Pisces",
    "phase": "Supercluster",
    "w": 8,
    "h": 8,
    "start": [
      6,
      7
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        1,
        4,
        5,
        6,
        3,
        7,
        4,
        6
      ],
      [
        1,
        3,
        2,
        2,
        4,
        6,
        2,
        5
      ],
      [
        3,
        4,
        2,
        4,
        6,
        2,
        7,
        1
      ],
      [
        3,
        1,
        2,
        3,
        7,
        2,
        6,
        2
      ],
      [
        4,
        3,
        5,
        2,
        2,
        6,
        3,
        5
      ],
      [
        4,
        2,
        4,
        2,
        5,
        5,
        1,
        7
      ],
      [
        3,
        6,
        1,
        1,
        5,
        4,
        2,
        3
      ],
      [
        7,
        2,
        2,
        4,
        1,
        1,
        1,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Shapley Concentration",
    "phase": "Supercluster",
    "w": 8,
    "h": 8,
    "start": [
      5,
      5
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        3,
        2,
        1,
        1,
        2,
        7,
        7,
        7
      ],
      [
        4,
        1,
        6,
        5,
        2,
        5,
        4,
        2
      ],
      [
        4,
        2,
        2,
        2,
        5,
        2,
        2,
        1
      ],
      [
        1,
        3,
        6,
        7,
        5,
        1,
        5,
        5
      ],
      [
        3,
        2,
        6,
        3,
        4,
        5,
        3,
        6
      ],
      [
        6,
        7,
        3,
        6,
        7,
        3,
        2,
        7
      ],
      [
        7,
        3,
        3,
        3,
        1,
        7,
        5,
        2
      ],
      [
        5,
        7,
        6,
        3,
        7,
        6,
        1,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Galaxy Filament",
    "phase": "Supercluster",
    "w": 8,
    "h": 8,
    "start": [
      6,
      2
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        2,
        3,
        3,
        4,
        4,
        3,
        3,
        3
      ],
      [
        7,
        6,
        1,
        2,
        4,
        5,
        6,
        2
      ],
      [
        5,
        6,
        7,
        3,
        3,
        5,
        6,
        2
      ],
      [
        5,
        5,
        7,
        3,
        7,
        4,
        5,
        7
      ],
      [
        1,
        2,
        4,
        1,
        1,
        6,
        5,
        2
      ],
      [
        5,
        5,
        4,
        4,
        1,
        6,
        3,
        3
      ],
      [
        3,
        6,
        1,
        5,
        4,
        1,
        7,
        6
      ],
      [
        1,
        2,
        7,
        1,
        3,
        5,
        1,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Deep Field Node",
    "phase": "Supercluster",
    "w": 8,
    "h": 8,
    "start": [
      1,
      2
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        1,
        5,
        7,
        6,
        7,
        2,
        7,
        6
      ],
      [
        6,
        3,
        4,
        1,
        3,
        2,
        5,
        1
      ],
      [
        5,
        7,
        2,
        5,
        5,
        4,
        2,
        5
      ],
      [
        3,
        2,
        1,
        4,
        6,
        1,
        5,
        5
      ],
      [
        3,
        4,
        5,
        5,
        5,
        7,
        2,
        1
      ],
      [
        4,
        1,
        6,
        5,
        6,
        7,
        1,
        1
      ],
      [
        1,
        4,
        1,
        5,
        4,
        2,
        1,
        7
      ],
      [
        1,
        6,
        1,
        2,
        1,
        1,
        3,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Mega-Parsec Weave",
    "phase": "Supercluster",
    "w": 8,
    "h": 8,
    "start": [
      7,
      2
    ],
    "goal": [
      0,
      7
    ],
    "grid": [
      [
        1,
        6,
        4,
        1,
        5,
        6,
        6,
        0
      ],
      [
        4,
        5,
        5,
        6,
        3,
        6,
        2,
        3
      ],
      [
        6,
        3,
        1,
        3,
        5,
        4,
        6,
        1
      ],
      [
        2,
        1,
        4,
        1,
        4,
        4,
        5,
        5
      ],
      [
        6,
        3,
        2,
        2,
        2,
        3,
        3,
        6
      ],
      [
        2,
        2,
        1,
        5,
        4,
        4,
        3,
        2
      ],
      [
        5,
        2,
        5,
        6,
        3,
        4,
        1,
        3
      ],
      [
        5,
        2,
        6,
        1,
        6,
        4,
        3,
        7
      ]
    ],
    "optimal": 12
  },
  {
    "name": "Cosmic Macrocosm",
    "phase": "Supercluster",
    "w": 8,
    "h": 8,
    "start": [
      5,
      5
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        1,
        4,
        3,
        6,
        7,
        3,
        7,
        6
      ],
      [
        7,
        4,
        5,
        6,
        5,
        3,
        5,
        4
      ],
      [
        3,
        6,
        4,
        1,
        3,
        7,
        7,
        5
      ],
      [
        3,
        5,
        5,
        5,
        4,
        4,
        4,
        4
      ],
      [
        5,
        2,
        1,
        4,
        3,
        4,
        2,
        2
      ],
      [
        4,
        6,
        7,
        4,
        4,
        2,
        7,
        5
      ],
      [
        2,
        7,
        2,
        2,
        1,
        3,
        2,
        5
      ],
      [
        5,
        3,
        3,
        3,
        7,
        4,
        6,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Bootes Void",
    "phase": "Void Nexus",
    "w": 8,
    "h": 8,
    "start": [
      5,
      6
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        2,
        1,
        1,
        6,
        4,
        1,
        5,
        7
      ],
      [
        6,
        3,
        4,
        2,
        2,
        5,
        6,
        7
      ],
      [
        3,
        4,
        1,
        3,
        3,
        4,
        5,
        1
      ],
      [
        3,
        6,
        5,
        4,
        4,
        4,
        2,
        5
      ],
      [
        2,
        3,
        4,
        2,
        2,
        3,
        6,
        3
      ],
      [
        7,
        3,
        5,
        1,
        4,
        4,
        6,
        6
      ],
      [
        2,
        4,
        2,
        1,
        4,
        4,
        5,
        7
      ],
      [
        7,
        2,
        5,
        1,
        6,
        5,
        6,
        0
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Abyssal Gate",
    "phase": "Void Nexus",
    "w": 8,
    "h": 8,
    "start": [
      0,
      2
    ],
    "goal": [
      6,
      1
    ],
    "grid": [
      [
        6,
        3,
        2,
        4,
        5,
        7,
        4,
        3
      ],
      [
        1,
        5,
        5,
        4,
        1,
        5,
        4,
        5
      ],
      [
        2,
        5,
        4,
        5,
        5,
        2,
        4,
        7
      ],
      [
        2,
        5,
        4,
        2,
        1,
        2,
        1,
        3
      ],
      [
        2,
        1,
        1,
        1,
        4,
        5,
        3,
        3
      ],
      [
        4,
        2,
        3,
        4,
        3,
        4,
        5,
        4
      ],
      [
        2,
        0,
        5,
        1,
        1,
        2,
        1,
        4
      ],
      [
        4,
        3,
        7,
        1,
        5,
        2,
        7,
        7
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Entropy Peak",
    "phase": "Void Nexus",
    "w": 8,
    "h": 8,
    "start": [
      6,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        0,
        4,
        4,
        5,
        2,
        5,
        3,
        5
      ],
      [
        3,
        4,
        1,
        3,
        4,
        2,
        1,
        6
      ],
      [
        7,
        1,
        1,
        4,
        4,
        5,
        4,
        5
      ],
      [
        1,
        2,
        1,
        2,
        3,
        5,
        6,
        7
      ],
      [
        5,
        4,
        4,
        2,
        2,
        2,
        4,
        7
      ],
      [
        7,
        1,
        3,
        1,
        1,
        1,
        5,
        7
      ],
      [
        7,
        3,
        5,
        4,
        4,
        6,
        2,
        4
      ],
      [
        6,
        7,
        7,
        2,
        5,
        1,
        6,
        1
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Cosmic Chasm",
    "phase": "Void Nexus",
    "w": 8,
    "h": 8,
    "start": [
      0,
      2
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        6,
        2,
        1,
        2,
        5,
        4,
        1,
        3
      ],
      [
        2,
        2,
        7,
        3,
        3,
        2,
        7,
        1
      ],
      [
        5,
        7,
        3,
        3,
        5,
        4,
        4,
        3
      ],
      [
        1,
        1,
        5,
        7,
        6,
        2,
        4,
        2
      ],
      [
        1,
        4,
        7,
        6,
        3,
        1,
        2,
        1
      ],
      [
        6,
        5,
        3,
        1,
        6,
        7,
        2,
        1
      ],
      [
        7,
        3,
        3,
        5,
        6,
        1,
        4,
        7
      ],
      [
        1,
        3,
        4,
        5,
        1,
        2,
        6,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Null Continuum",
    "phase": "Void Nexus",
    "w": 8,
    "h": 8,
    "start": [
      0,
      4
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        4,
        2,
        4,
        4,
        1,
        4,
        4,
        6
      ],
      [
        5,
        1,
        4,
        6,
        2,
        5,
        1,
        5
      ],
      [
        7,
        5,
        5,
        6,
        1,
        1,
        6,
        3
      ],
      [
        4,
        5,
        5,
        6,
        5,
        5,
        3,
        5
      ],
      [
        2,
        3,
        5,
        2,
        3,
        4,
        2,
        4
      ],
      [
        6,
        7,
        1,
        5,
        4,
        2,
        5,
        5
      ],
      [
        4,
        7,
        3,
        1,
        4,
        6,
        5,
        2
      ],
      [
        6,
        4,
        7,
        5,
        2,
        5,
        1,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Oblivion Vector",
    "phase": "Void Nexus",
    "w": 8,
    "h": 8,
    "start": [
      4,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        6,
        5,
        7,
        1,
        4,
        3,
        1,
        6
      ],
      [
        4,
        1,
        4,
        1,
        5,
        3,
        5,
        4
      ],
      [
        4,
        6,
        7,
        3,
        1,
        1,
        5,
        2
      ],
      [
        3,
        4,
        7,
        3,
        6,
        7,
        4,
        5
      ],
      [
        5,
        4,
        5,
        6,
        2,
        1,
        1,
        4
      ],
      [
        3,
        1,
        4,
        3,
        1,
        5,
        4,
        5
      ],
      [
        3,
        5,
        3,
        4,
        1,
        1,
        7,
        7
      ],
      [
        7,
        1,
        2,
        1,
        4,
        3,
        4,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Desolation Node",
    "phase": "Void Nexus",
    "w": 8,
    "h": 8,
    "start": [
      5,
      1
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        1,
        7,
        7,
        5,
        6,
        6,
        7,
        2
      ],
      [
        1,
        7,
        6,
        6,
        6,
        1,
        3,
        3
      ],
      [
        6,
        3,
        6,
        5,
        2,
        1,
        1,
        1
      ],
      [
        7,
        3,
        1,
        2,
        1,
        4,
        5,
        6
      ],
      [
        2,
        4,
        2,
        4,
        3,
        2,
        7,
        1
      ],
      [
        6,
        3,
        3,
        5,
        6,
        1,
        4,
        4
      ],
      [
        1,
        5,
        5,
        7,
        1,
        5,
        3,
        6
      ],
      [
        7,
        7,
        1,
        1,
        4,
        4,
        6,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Absolute Zero",
    "phase": "Void Nexus",
    "w": 8,
    "h": 8,
    "start": [
      5,
      5
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        5,
        3,
        6,
        5,
        6,
        2,
        1,
        6
      ],
      [
        5,
        5,
        5,
        2,
        5,
        2,
        7,
        7
      ],
      [
        7,
        6,
        4,
        6,
        3,
        4,
        7,
        5
      ],
      [
        2,
        6,
        1,
        3,
        5,
        2,
        1,
        7
      ],
      [
        2,
        3,
        2,
        7,
        3,
        5,
        6,
        1
      ],
      [
        4,
        7,
        2,
        1,
        7,
        2,
        4,
        6
      ],
      [
        1,
        6,
        6,
        4,
        3,
        4,
        3,
        5
      ],
      [
        6,
        3,
        6,
        1,
        2,
        1,
        7,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Terminal Vacuum",
    "phase": "Void Nexus",
    "w": 8,
    "h": 8,
    "start": [
      5,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        3,
        7,
        7,
        4,
        1,
        4,
        3,
        1
      ],
      [
        3,
        4,
        5,
        2,
        3,
        1,
        3,
        4
      ],
      [
        7,
        1,
        5,
        7,
        2,
        4,
        4,
        2
      ],
      [
        3,
        5,
        6,
        2,
        3,
        7,
        2,
        5
      ],
      [
        5,
        2,
        4,
        2,
        5,
        4,
        7,
        7
      ],
      [
        3,
        2,
        7,
        7,
        2,
        6,
        5,
        2
      ],
      [
        1,
        4,
        1,
        5,
        4,
        1,
        2,
        3
      ],
      [
        1,
        3,
        7,
        1,
        3,
        2,
        2,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Vacuum Metastability",
    "phase": "Void Nexus",
    "w": 8,
    "h": 8,
    "start": [
      5,
      2
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        4,
        4,
        1,
        4,
        2,
        4,
        2,
        2
      ],
      [
        6,
        1,
        1,
        4,
        7,
        5,
        4,
        2
      ],
      [
        1,
        2,
        2,
        4,
        2,
        6,
        2,
        7
      ],
      [
        7,
        6,
        4,
        7,
        5,
        3,
        7,
        2
      ],
      [
        5,
        2,
        2,
        3,
        2,
        2,
        5,
        2
      ],
      [
        7,
        3,
        1,
        1,
        5,
        7,
        4,
        4
      ],
      [
        5,
        5,
        4,
        3,
        4,
        3,
        1,
        7
      ],
      [
        5,
        4,
        5,
        3,
        3,
        4,
        7,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Cosmic Mind",
    "phase": "Omniscience",
    "w": 8,
    "h": 8,
    "start": [
      5,
      6
    ],
    "goal": [
      7,
      0
    ],
    "grid": [
      [
        5,
        1,
        5,
        4,
        1,
        5,
        7,
        1
      ],
      [
        5,
        4,
        3,
        3,
        2,
        3,
        2,
        7
      ],
      [
        5,
        2,
        1,
        2,
        3,
        3,
        4,
        4
      ],
      [
        1,
        5,
        4,
        4,
        2,
        5,
        5,
        1
      ],
      [
        7,
        1,
        3,
        2,
        1,
        2,
        1,
        2
      ],
      [
        4,
        3,
        4,
        5,
        5,
        1,
        1,
        6
      ],
      [
        6,
        3,
        5,
        4,
        5,
        5,
        2,
        3
      ],
      [
        0,
        2,
        5,
        3,
        1,
        7,
        4,
        3
      ]
    ],
    "optimal": 10
  },
  {
    "name": "First Principles",
    "phase": "Omniscience",
    "w": 8,
    "h": 8,
    "start": [
      1,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        7,
        3,
        7,
        7,
        3,
        4,
        1,
        5
      ],
      [
        4,
        7,
        1,
        7,
        1,
        7,
        5,
        1
      ],
      [
        5,
        2,
        2,
        3,
        1,
        6,
        3,
        3
      ],
      [
        2,
        6,
        6,
        6,
        1,
        2,
        2,
        7
      ],
      [
        7,
        2,
        2,
        5,
        7,
        2,
        2,
        5
      ],
      [
        5,
        7,
        4,
        2,
        2,
        6,
        4,
        7
      ],
      [
        7,
        1,
        7,
        1,
        3,
        5,
        3,
        2
      ],
      [
        4,
        1,
        5,
        2,
        6,
        6,
        6,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Unified Field",
    "phase": "Omniscience",
    "w": 8,
    "h": 8,
    "start": [
      1,
      6
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        3,
        2,
        2,
        1,
        5,
        5,
        2,
        3
      ],
      [
        2,
        5,
        1,
        4,
        6,
        1,
        5,
        3
      ],
      [
        3,
        6,
        2,
        2,
        3,
        2,
        6,
        6
      ],
      [
        6,
        6,
        3,
        1,
        1,
        5,
        1,
        1
      ],
      [
        1,
        2,
        1,
        2,
        1,
        1,
        6,
        1
      ],
      [
        4,
        2,
        5,
        2,
        4,
        3,
        5,
        4
      ],
      [
        3,
        5,
        3,
        4,
        5,
        5,
        6,
        4
      ],
      [
        1,
        4,
        5,
        6,
        6,
        2,
        7,
        0
      ]
    ],
    "optimal": 11
  },
  {
    "name": "Quantum Gravity",
    "phase": "Omniscience",
    "w": 8,
    "h": 8,
    "start": [
      2,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        4,
        6,
        6,
        6,
        2,
        3,
        3,
        1
      ],
      [
        3,
        5,
        2,
        2,
        4,
        7,
        5,
        1
      ],
      [
        1,
        1,
        2,
        1,
        3,
        6,
        2,
        3
      ],
      [
        6,
        1,
        6,
        6,
        2,
        1,
        2,
        1
      ],
      [
        5,
        5,
        5,
        1,
        7,
        1,
        4,
        1
      ],
      [
        4,
        1,
        6,
        3,
        2,
        2,
        1,
        7
      ],
      [
        7,
        5,
        6,
        7,
        3,
        3,
        6,
        5
      ],
      [
        6,
        2,
        5,
        6,
        3,
        6,
        6,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Omniscient Sight",
    "phase": "Omniscience",
    "w": 8,
    "h": 8,
    "start": [
      3,
      4
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        6,
        1,
        1,
        5,
        1,
        4,
        7,
        6
      ],
      [
        2,
        2,
        1,
        4,
        7,
        4,
        1,
        7
      ],
      [
        6,
        1,
        2,
        4,
        6,
        3,
        1,
        6
      ],
      [
        5,
        5,
        1,
        1,
        4,
        2,
        4,
        7
      ],
      [
        3,
        1,
        1,
        4,
        3,
        3,
        4,
        7
      ],
      [
        7,
        2,
        2,
        4,
        3,
        7,
        6,
        5
      ],
      [
        4,
        6,
        7,
        2,
        3,
        2,
        5,
        1
      ],
      [
        7,
        1,
        7,
        5,
        7,
        5,
        2,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Ultimate Constant",
    "phase": "Omniscience",
    "w": 8,
    "h": 8,
    "start": [
      7,
      2
    ],
    "goal": [
      6,
      1
    ],
    "grid": [
      [
        6,
        1,
        3,
        7,
        7,
        7,
        2,
        6
      ],
      [
        3,
        2,
        4,
        5,
        6,
        2,
        3,
        5
      ],
      [
        6,
        5,
        5,
        1,
        5,
        1,
        4,
        5
      ],
      [
        4,
        6,
        5,
        1,
        1,
        4,
        3,
        7
      ],
      [
        5,
        3,
        1,
        2,
        1,
        3,
        1,
        3
      ],
      [
        6,
        6,
        4,
        4,
        2,
        3,
        3,
        6
      ],
      [
        7,
        0,
        6,
        6,
        5,
        4,
        6,
        2
      ],
      [
        2,
        2,
        7,
        3,
        2,
        4,
        2,
        7
      ]
    ],
    "optimal": 12
  },
  {
    "name": "Monad",
    "phase": "Omniscience",
    "w": 8,
    "h": 8,
    "start": [
      1,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        5,
        4,
        3,
        6,
        3,
        3,
        6,
        1
      ],
      [
        2,
        6,
        2,
        6,
        3,
        6,
        2,
        4
      ],
      [
        4,
        5,
        4,
        2,
        7,
        1,
        2,
        4
      ],
      [
        4,
        5,
        2,
        1,
        3,
        3,
        6,
        1
      ],
      [
        4,
        7,
        2,
        3,
        1,
        7,
        3,
        5
      ],
      [
        7,
        1,
        6,
        7,
        4,
        3,
        3,
        7
      ],
      [
        4,
        7,
        5,
        6,
        1,
        3,
        1,
        1
      ],
      [
        1,
        1,
        1,
        7,
        1,
        3,
        7,
        0
      ]
    ],
    "optimal": 6
  },
  {
    "name": "The Final Theorem",
    "phase": "Omniscience",
    "w": 8,
    "h": 8,
    "start": [
      6,
      6
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        7,
        6,
        3,
        2,
        3,
        1,
        3,
        5
      ],
      [
        2,
        6,
        1,
        3,
        1,
        7,
        5,
        4
      ],
      [
        1,
        2,
        3,
        4,
        4,
        2,
        6,
        5
      ],
      [
        3,
        3,
        1,
        4,
        6,
        1,
        2,
        3
      ],
      [
        1,
        5,
        7,
        4,
        7,
        3,
        3,
        3
      ],
      [
        7,
        6,
        2,
        2,
        6,
        2,
        7,
        5
      ],
      [
        4,
        5,
        2,
        1,
        5,
        7,
        1,
        6
      ],
      [
        7,
        7,
        4,
        7,
        2,
        2,
        2,
        0
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Singular Truth",
    "phase": "Omniscience",
    "w": 8,
    "h": 8,
    "start": [
      5,
      3
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        2,
        3,
        3,
        6,
        5,
        2,
        1,
        1
      ],
      [
        5,
        2,
        1,
        1,
        4,
        7,
        6,
        2
      ],
      [
        1,
        6,
        7,
        1,
        4,
        4,
        7,
        7
      ],
      [
        1,
        3,
        2,
        3,
        1,
        3,
        6,
        1
      ],
      [
        2,
        5,
        4,
        1,
        4,
        3,
        1,
        2
      ],
      [
        7,
        7,
        3,
        2,
        2,
        6,
        1,
        2
      ],
      [
        6,
        6,
        7,
        6,
        5,
        7,
        1,
        6
      ],
      [
        2,
        4,
        1,
        2,
        1,
        3,
        1,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Omega Point",
    "phase": "Omniscience",
    "w": 8,
    "h": 8,
    "start": [
      2,
      3
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        4,
        2,
        1,
        3,
        4,
        3,
        6,
        7
      ],
      [
        4,
        1,
        3,
        3,
        1,
        5,
        4,
        1
      ],
      [
        1,
        7,
        1,
        1,
        1,
        4,
        5,
        2
      ],
      [
        2,
        7,
        7,
        3,
        1,
        6,
        3,
        3
      ],
      [
        5,
        2,
        4,
        1,
        5,
        2,
        2,
        3
      ],
      [
        4,
        4,
        6,
        4,
        6,
        5,
        1,
        3
      ],
      [
        2,
        3,
        6,
        3,
        1,
        4,
        4,
        3
      ],
      [
        1,
        5,
        4,
        6,
        3,
        6,
        3,
        0
      ]
    ],
    "optimal": 7
  }
];
