# Spanish-English Memory Game

A fun and interactive memory game to learn Spanish and English vocabulary while improving your memory skills.

This project is a web-based memory game that challenges players to match Spanish words with their English translations. Built with React and TypeScript, it features a responsive design, animations, and sound effects to create an engaging learning experience.

The game presents a grid of cards, each containing either a Spanish word or its English translation. Players must flip the cards and find matching pairs within a time limit. As players progress, they earn points for correct matches and lose points for incorrect ones. The game ends when all pairs are matched or when the time runs out.

Key features include:
- Randomized word pairs for each game session
- Interactive card flipping with animations
- Score tracking and timer
- Sound effects for card flips, matches, and game completion
- Responsive design for various screen sizes
- Win and lose conditions with appropriate feedback

## Repository Structure

```
.
├── src/
│   ├── components/
│   │   ├── Card.tsx
│   │   ├── GameFooter.tsx
│   │   ├── GameHeader.tsx
│   │   └── MemoryGame.tsx
│   ├── hooks/
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   └── Index.tsx
│   ├── utils/
│   │   ├── gameUtils.ts
│   │   └── soundUtils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── wordPairs.json
├── eslint.config.js
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Key Files:
- `src/components/MemoryGame.tsx`: The main game component that manages the game state and logic.
- `src/components/Card.tsx`: Represents a single card in the memory game.
- `src/pages/Index.tsx`: The main page component that renders the MemoryGame.
- `src/App.tsx`: The root component that sets up routing and global providers.
- `src/wordPairs.json`: Contains the Spanish-English word pairs used in the game.
- `vite.config.ts`: Configuration file for the Vite build tool.

## Usage Instructions

### Installation

Prerequisites:
- Node.js (v14 or later)
- npm (v6 or later)

To install the project dependencies, run the following command in the project root directory:

```bash
npm install
```

### Getting Started

To start the development server, run:

```bash
npm run dev
```

This will start the application on `http://localhost:8080`.

### Building for Production

To create a production build, run:

```bash
npm run build
```

The built files will be available in the `dist` directory.

### Configuration Options

The game can be customized by modifying the following files:
- `src/wordPairs.json`: Add or modify Spanish-English word pairs.
- `src/components/MemoryGame.tsx`: Adjust game parameters such as timer duration and scoring.

### Testing & Quality

To run the linter, use:

```bash
npm run lint
```

### Troubleshooting

Common issues and solutions:

1. Problem: Cards not flipping when clicked
   - Error message: None
   - Diagnostic process:
     1. Check the browser console for any JavaScript errors
     2. Verify that the `handleCardClick` function in `MemoryGame.tsx` is being called
   - Solution: Ensure that the `onClick` prop is correctly passed to the `Card` component

2. Problem: Game not ending when timer reaches zero
   - Error message: None
   - Diagnostic process:
     1. Add console.log statements in the timer useEffect hook in `MemoryGame.tsx`
     2. Verify that the `setIsGameOver` function is being called when the timer reaches zero
   - Solution: Check the condition in the timer useEffect hook and ensure it's correctly setting the game over state

3. Problem: Sound effects not playing
   - Error message: "Failed to load resource: net::ERR_FILE_NOT_FOUND"
   - Diagnostic process:
     1. Check the browser console for any resource loading errors
     2. Verify that the sound files are correctly imported in `MemoryGame.tsx`
   - Solution: Ensure that the sound files are in the correct directory and properly imported

## Data Flow

The Spanish-English Memory Game follows a unidirectional data flow pattern. Here's an overview of how data flows through the application:

1. The game starts in the `MemoryGame` component, which initializes the game state.
2. Word pairs are loaded from `wordPairs.json` and shuffled to create a random set of cards.
3. The game state, including card positions, flipped status, and matches, is managed in the `MemoryGame` component.
4. User interactions (card clicks) trigger the `handleCardClick` function in `MemoryGame`.
5. Card flips and matches update the game state, which is then passed down to child components.
6. The `GameHeader` component receives and displays the current score, timer, and match count.
7. The `Card` components receive their individual states and render accordingly.
8. The `GameFooter` component receives the game state and provides options to restart the game.

```
┌─────────────────┐
│    MemoryGame   │
│  (Main State)   │
└─────────┬───────┘
          │
          ▼
┌─────────┴───────┐
│   Game Logic    │
│  (handleClick)  │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────┐
│  Cards  │ │  Header │
└─────────┘ └─────────┘
```

Note: The game uses React's state management and prop passing to maintain a single source of truth for the game state.