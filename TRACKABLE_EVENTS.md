# Trackable Events in the Memory Game

Based on the code analysis, here are the key events that can be tracked in this Spanish-English memory game:

## Game Session Events
1. Game Initialization
   - New game started
   - Initial score set (100 points)
   - Timer started (90 seconds)

2. Game Completion Events
   - Game won (all pairs matched)
   - Game lost (timer reaches 0 or score drops to 0)
   - Final score achieved
   - Time remaining when completed

## Player Interaction Events
1. Card Interactions
   - Card flips
   - Number of attempts (pairs of cards flipped)
   - Invalid card selections (clicking matched/flipped cards)

2. Matching Events
   - Successful matches made
   - Failed matches
   - Progress tracking (X/8 pairs matched)

## Scoring Events
1. Score Changes
   - Points gained (100 points per successful match)
   - Points lost (10 points per failed match)
   - Current score at any point

## Time-Related Events
1. Timer Events
   - Time remaining updates
   - Time elapsed
   - Game over due to time expiration

## Sound Events
1. Audio Feedback
   - Card flip sound played
   - Success sound played
   - Error sound played
   - Celebration sound played

## UI Interaction Events
1. Button Clicks
   - "New Game" button pressed
   - Card clicks

Each of these events can be tracked to:
- Analyze player performance
- Improve game difficulty
- Generate statistics
- Create leaderboards
- Optimize game mechanics
- Monitor user engagement