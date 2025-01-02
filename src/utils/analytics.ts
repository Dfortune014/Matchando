// Analytics utility for tracking game events
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

// Ensure all event tracking functions handle async properly
async function sendToAWS(event: string, properties?: Record<string, any>) {
  await trackEvent(event, properties);
}

interface GameEvent {
  event: string;
  properties?: Record<string, any>;
}

const eventBridgeClient = new EventBridgeClient({ 
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
});

export const trackEvent = async (event: string, properties?: Record<string, any>) => {
  try {
    const params = {
      Entries: [
        {
          Source: 'com.memorygame',
          DetailType: event,
          Detail: JSON.stringify({
            timestamp: new Date().toISOString(),
            ...properties
          }),
          EventBusName: 'default'
        }
      ]
    };

    const command = new PutEventsCommand(params);
    await eventBridgeClient.send(command);
    
    // Also log locally for debugging
    console.log('Track Event:', { event, properties });
  } catch (error) {
    console.error('Failed to send event to AWS:', error);
  }
};

// Game Session Events
export const trackGameStart = () => sendToAWS('game_started');
export const trackGameOver = (score: number, timeRemaining: number) => 
  sendToAWS('game_over', { score, timeRemaining });
export const trackGameWon = (score: number, timeElapsed: number) => 
  sendToAWS('game_won', { score, timeElapsed });

// Card Interaction Events
export const trackCardFlip = (cardId: number, cardType: string) => 
  sendToAWS('card_flipped', { cardId, cardType });
export const trackCardMatch = (matchNumber: number, score: number) => 
  sendToAWS('cards_matched', { matchNumber, score });
export const trackIncorrectMatch = (currentScore: number) => 
  sendToAWS('incorrect_match', { currentScore });

// Sound Events
export const trackSoundPlayed = (soundType: string) => 
  sendToAWS('sound_played', { soundType });

// UI Events
export const trackNewGameClick = () => sendToAWS('new_game_clicked');