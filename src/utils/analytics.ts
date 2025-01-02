// Analytics utility for tracking game events
import { LAMBDA_CONFIG } from "./lambdaConfig";

interface GameEvent {
  eventType: string;
  data: {
    timestamp: string;
    [key: string]: any;
  };
}

export const sendToAWS = async (
  event: string,
  properties?: Record<string, any>
) => {
  await trackEvent(event, properties);
};

const trackEvent = async (event: string, properties?: Record<string, any>) => {
  try {
    const payload = {
      eventType: event,
      data: {
        timestamp: new Date().toISOString(),
        ...properties
      }
    };

    const response = await fetch(LAMBDA_CONFIG.FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Also log locally for debugging
    console.log("Track Event:", payload);
  } catch (error) {
    console.error("Failed to send event to AWS:", error);
  }
};

// Game Session Events
export const trackGameStart = () => sendToAWS("game_started");
export const trackGameOver = (score: number, timeRemaining: number) =>
  sendToAWS("game_over", { score, timeRemaining });
export const trackGameWon = (score: number, timeElapsed: number) =>
  sendToAWS("game_won", { score, timeElapsed });

// Card Interaction Events
export const trackCardFlip = (cardId: number, cardType: string) =>
  sendToAWS("card_flipped", { cardId, cardType });
export const trackCardMatch = (matchNumber: number, score: number) =>
  sendToAWS("cards_matched", { matchNumber, score });
export const trackIncorrectMatch = (currentScore: number) =>
  sendToAWS("incorrect_match", { currentScore });

// Sound Events
export const trackSoundPlayed = (soundType: string) =>
  sendToAWS("sound_played", { soundType });

// UI Events
export const trackNewGameClick = () => sendToAWS("new_game_clicked");
