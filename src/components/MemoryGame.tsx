import React, { useState, useEffect } from "react";
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

  const gameOverAnimation = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const initializeGame = () => {
    // Shuffle the word pairs and select the first eight pairs
    const shuffledPairs = shuffle(wordPairs);
    const selectedPairs = shuffledPairs.slice(0, 8);

    const gameCards: CardType[] = [];
    selectedPairs.forEach((pair, index) => {
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
    setCards(shuffle(gameCards));
    setFlippedCards([]);
    setMatches(0);
    setScore(100);
    setTimer(90);
    setIsGameOver(false);
    setShowWinMessage(false);
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
        const isMatch = wordPairs.some(
          (pair) =>
            (firstCard.content === pair.spanish &&
              secondCard.content === pair.english) ||
            (firstCard.content === pair.english &&
              secondCard.content === pair.spanish)
        );

        if (isMatch) {
          playSound(successSound);
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: true, isMatched: true }
                : card
            )
          );
          setMatches((prev) => {
            const newMatches = prev + 1;
            if (newMatches === wordPairs.length) {
              playSound(celebrationSound);
              setShowWinMessage(true);
              toast("¡Felicitaciones! You've completed the game! 🎉");
            }
            return newMatches;
          });
          setScore((prev) => prev + 100);
        } else {
          playSound(errorSound);
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
        setTimeout(() => setIsChecking(false), 1000);
      }
      setFlippedCards([]);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <GameHeader
          matches={matches}
          totalPairs={wordPairs.length}
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
          totalPairs={wordPairs.length}
        />
      </div>
    </div>
  );
};

export default MemoryGame;
