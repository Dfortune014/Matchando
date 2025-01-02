import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Card from "./Card";
import GameHeader from "./GameHeader";
import GameFooter from "./GameFooter";
import { shuffle } from "../utils/gameUtils";
import flipSound from "../assets/sounds/flip.wav";
import successSound from "../assets/sounds/success.wav";
import errorSound from "../assets/sounds/error.mp3";
import celebrationSound from "../assets/sounds/celebration.mp3";
import { playSound } from "../utils/soundUtils";
import wordPairs from "../wordPairs.json";
import {
  trackGameStart,
  trackGameOver,
  trackGameWon,
  trackCardFlip,
  trackCardMatch,
  trackIncorrectMatch,
  trackNewGameClick,
} from "../utils/analytics";
import { sendMatchEvent } from "../utils/api";

export interface CardType {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  type: "spanish" | "english";
}

const MemoryGame = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(100);
  const [showWinMessage, setShowWinMessage] = useState(false);

  const [gameKey, setGameKey] = useState(0);
  const selectedPairs = useMemo(
    () => shuffle(wordPairs).slice(0, 8),
    [gameKey]
  );

  const gameOverAnimation = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  const initializeGame = () => {
    console.log("Selected pairs for new game:", selectedPairs);
    const gameCards: CardType[] = [];

    selectedPairs.forEach((pair, index) => {
      console.log(`Creating cards for pair ${index}:`, pair);
      gameCards.push({
        id: index * 2,
        content: pair.spanish,
        isFlipped: false,
        isMatched: false,
        type: "spanish",
      });
      gameCards.push({
        id: index * 2 + 1,
        content: pair.english,
        isFlipped: false,
        isMatched: false,
        type: "english",
      });
    });

    const shuffledCards = shuffle(gameCards);
    console.log("Final shuffled cards:", shuffledCards);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setScore(100);
    setTimer(90);
    setIsGameOver(false);
    setShowWinMessage(false);
    trackGameStart();
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (isGameOver || showWinMessage) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameOver, showWinMessage]);

  useEffect(() => {
    if (score <= 0) {
      setIsGameOver(true);
    }
  }, [score]);

  const debugMatch = (firstCard: CardType, secondCard: CardType) => {
    console.group("Match Debug");
    console.log("First Card:", {
      content: firstCard.content,
      type: firstCard.type,
    });
    console.log("Second Card:", {
      content: secondCard.content,
      type: secondCard.type,
    });

    // Check if either card's content exists in any pair
    const firstCardExists = selectedPairs.some(
      (pair) =>
        pair.spanish === firstCard.content || pair.english === firstCard.content
    );
    const secondCardExists = selectedPairs.some(
      (pair) =>
        pair.spanish === secondCard.content ||
        pair.english === secondCard.content
    );

    console.log("First card exists in pairs:", firstCardExists);
    console.log("Second card exists in pairs:", secondCardExists);

    if (!firstCardExists || !secondCardExists) {
      console.warn("One or both cards are not in the selected pairs!");
      console.log("Available pairs:", selectedPairs);
    }

    const matchingPair = selectedPairs.find(
      (pair) =>
        (firstCard.content === pair.spanish &&
          secondCard.content === pair.english) ||
        (firstCard.content === pair.english &&
          secondCard.content === pair.spanish)
    );
    console.log("Matching Pair Found:", matchingPair);
    console.groupEnd();
  };

  const handleCardClick = (id: number) => {
    if (isGameOver || showWinMessage) return;
    if (
      isChecking ||
      flippedCards.includes(id) ||
      cards.find((card) => card.id === id)?.isMatched ||
      flippedCards.length === 2
    ) {
      return;
    }

    playSound(flipSound);
    const clickedCard = cards.find((card) => card.id === id);
    if (clickedCard) {
      trackCardFlip(id, clickedCard.type);
    }
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard && secondCard) {
        debugMatch(firstCard, secondCard);

        // Check if it's a valid match
        const isMatch =
          // Check if first card is Spanish and second is English
          (firstCard.type === "spanish" &&
            secondCard.type === "english" &&
            selectedPairs.some(
              (pair) =>
                pair.spanish === firstCard.content &&
                pair.english === secondCard.content
            )) ||
          // Check if first card is English and second is Spanish
          (firstCard.type === "english" &&
            secondCard.type === "spanish" &&
            selectedPairs.some(
              (pair) =>
                pair.english === firstCard.content &&
                pair.spanish === secondCard.content
            ));

        if (isMatch) {
          playSound(successSound);
          trackCardMatch(matches + 1, score + 100);
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: true, isMatched: true }
                : card
            )
          );
          setMatches((prev) => {
            const newMatches = prev + 1;
            if (newMatches === selectedPairs.length) {
              playSound(celebrationSound);
              trackGameWon(score, 90 - timer);
              setShowWinMessage(true);
              toast("¡Felicitaciones! You've completed the game! 🎉");
            }
            return newMatches;
          });
          setScore((prev) => prev + 100);

          // Make the setTimeout callback async
          setTimeout(async () => {
            try {
              await sendMatchEvent({
                matchNumber: matches + 1,
                score: score + 100,
                timeElapsed: 90 - timer,
              });
            } catch (error) {
              console.error("Error sending match event:", error);
            }
          }, 100);
        } else {
          playSound(errorSound);
          trackIncorrectMatch(Math.max(score - 10, 0));
          setScore((prev) => Math.max(prev - 10, 0));
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) =>
                card.id === firstId || card.id === secondId
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
          }, 1000);
        }

        setTimeout(() => {
          setIsChecking(false);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <GameHeader
          matches={matches}
          totalPairs={selectedPairs.length}
          timer={timer}
          score={score}
        />
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              className="text-center py-6"
              variants={gameOverAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2 className="text-3xl font-bold text-red-500">Game Over!</h2>
              <p className="text-xl">Time's up! Try again!</p>
            </motion.div>
          )}
          {showWinMessage && (
            <motion.div
              className="text-center py-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-green-500">
                You Win!!! 🎉
              </h2>
              <p className="text-xl">Your Score: {score}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isFlipped={card.isFlipped}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
        <GameFooter
          onRestart={initializeGame}
          matches={matches}
          totalPairs={selectedPairs.length}
        />
      </div>
    </div>
  );
};

export default MemoryGame;
