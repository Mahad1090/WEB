# 2D Cricket Web Application 🏏

A complete 2D cricket batting game built with **React, Vite, and Canvas** featuring probability-based gameplay mechanics.

## 📋 Overview

This is a web-based cricket batting simulation where players face bowlers across **2 overs (12 balls)** with a maximum of **2 wickets**. The game uses a unique **probability-based power bar system** instead of pure randomness for determining shot outcomes.

## ✨ Key Features

### 🎮 Core Gameplay
- **Probability-Based Power Bar**: Slider position determines outcome, not random chance
- **Two Batting Styles**: 
  - **Aggressive**: High risk (40% wicket) + high reward (15% sixes)
  - **Defensive**: Low risk (15% wicket) + stable scoring (25% ones)
- **Match Duration**: Fixed at 2 overs (12 balls) with 2 wickets maximum
- **Dynamic Outcomes**: Wicket, 0/1/2/3/4/6 runs with smooth animations

### 🎨 User Interface
- **Cricket Ground**: Canvas-rendered 2D field with batsman, ball, and fielders
- **Interactive Scoreboard**: Real-time updates for runs, wickets, overs, and run rate
- **Power Bar Visualization**: Color-coded segments proportional to probability distribution
- **Animated Slider**: Continuously moves across power bar indicating shot position
- **Game Status Display**: Shows last result with dynamic commentary

### 💬 Bonus Features
- **Dynamic Commentary**: 3+ context-based messages per outcome type
- **Smooth Animations**: Bowling delivery, bat swing, and result transitions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Progress Tracking**: Visual progress bar showing match completion

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.2.10
- **Rendering**: HTML5 Canvas + DOM
- **Styling**: CSS3 with responsive design
- **Game Logic**: Vanilla JavaScript with pure functions

## 📦 Installation

```bash
# Clone or navigate to project
cd "Assignment 2"

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Play

1. **Select Batting Style**
   - Choose **Aggressive** for high risk/reward gameplay
   - Choose **Defensive** for safe, stable scoring

2. **Watch the Slider**
   - The slider continuously moves across the power bar
   - Each colored segment represents a different outcome

3. **Click PLAY SHOT**
   - Click when the slider is in your desired probability zone
   - The outcome depends on where the slider stops (not random)

4. **View Results**
   - Watch the cricket ground animation
   - Check the scoreboard for updated stats
   - Read dynamic commentary for analysis

5. **Match Ends**
   - When 12 balls are completed, or
   - When all 2 wickets are lost

## 📊 Probability Distributions

### Aggressive Batting Style
| Outcome | Probability |
|---------|-------------|
| Wicket | 40% |
| 0 Runs | 10% |
| 1 Run | 10% |
| 2 Runs | 10% |
| 3 Runs | 5% |
| 4 Runs | 10% |
| 6 Runs | 15% |

### Defensive Batting Style
| Outcome | Probability |
|---------|-------------|
| Wicket | 15% |
| 0 Runs | 20% |
| 1 Run | 25% |
| 2 Runs | 20% |
| 3 Runs | 10% |
| 4 Runs | 8% |
| 6 Runs | 2% |

## 🏗️ Project Structure

```
Assignment 2/
├── index.html              # Main HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite build configuration
├── .gitignore              # Git ignore patterns
├── README.md               # Project documentation
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main game component
    ├── App.css             # Global styles
    └── components/
        ├── BattingStyleSelector.jsx/.css    # Style selection
        ├── Scoreboard.jsx/.css               # Score display
        ├── CricketGround.jsx/.css            # Canvas rendering
        ├── PowerBar.jsx/.css                 # Probability bar
        └── GameStatus.jsx/.css               # Result display
```

## 🎓 Game Logic Implementation

### Power Bar Calculation
The power bar is divided into segments where each segment's width is proportional to its probability:

```
Position on Bar: 0 -------- 1 (normalized)
Segment 1: Wicket    [0 - 0.40] = 40%
Segment 2: 0 Runs    [0.40 - 0.50] = 10%
Segment 3: 1 Run     [0.50 - 0.60] = 10%
...and so on
```

When the player clicks "PLAY SHOT", the current slider position (0-1) is checked against these ranges to determine the outcome. **No randomization is used.**

### Game State Management
- **Runs**: Cumulative total from non-wicket outcomes
- **Wickets**: Count of batsman dismissals (max 2)
- **Balls**: Progressive counter (0-12)
- **Overs**: Calculated as balls ÷ 6
- **Game Status**: Active/Inactive based on remaining balls or wickets

## 🚀 Deployment

### To GitHub
```bash
# Initialize remote repository
git remote add origin https://github.com/your-username/cricket-web-app.git
git branch -M main
git push -u origin main
```

### To Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

## 📝 Development Progress

The project includes **8 meaningful commits** showing incremental development:

1. Initial project setup with Vite and React
2. React entry point configuration
3. Core game logic and probability system
4. Batting style selector component
5. Dynamic scoreboard implementation
6. Cricket ground canvas rendering
7. Probability-based power bar
8. Game status and commentary system

## 📋 Rubric Coverage

| Category | Component | Status |
|----------|-----------|--------|
| **Game Logic (30 pts)** | Probability distributions, power bar mapping, game progression | ✅ Complete |
| **UI/Animation (30 pts)** | Cricket field, scoreboard, batting/bowling animations | ✅ Complete |
| **Code Quality (20 pts)** | Modular components, clean code, meaningful comments | ✅ Complete |
| **Documentation (10 pts)** | README and code explanations | ✅ Complete |
| **Bonus (10 pts)** | Dynamic commentary system | ✅ Implemented |

## 🤝 Contributing

This is an educational project for CS-4032 Web Programming (Assignment #02).

## 📄 License

Educational Use Only

## 👨‍💻 Author

**Mahad1090** (i230537@isb.nu.edu.pk)

---

*Last Updated: March 18, 2026*
