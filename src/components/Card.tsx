import React from "react";
import { motion } from "framer-motion";
import { CardType } from "./MemoryGame";

interface CardProps {
  card: CardType;
  isFlipped: boolean;
  onClick: (id: number) => void;
}

const Card: React.FC<CardProps> = ({ card, isFlipped, onClick }) => {
  return (
    <div
      className="relative aspect-square cursor-pointer p-1"
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full rounded-lg"
        initial={false}
        animate={{ rotateY: isFlipped || card.isMatched ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Back */}
        <div
          className={`absolute w-full h-full bg-card rounded-lg border-2 border-accent/20 shadow-lg 
                      flex items-center justify-center text-white text-2xl font-bold
                      ${isFlipped || card.isMatched ? "backface-hidden" : ""}
                      bg-gradient-to-br from-secondary to-card`}
        >
          ?
        </div>

        {/* Card Front */}
        <div
          className={`absolute w-full h-full rounded-lg border-2 shadow-lg flex items-center justify-center p-2 
                      text-white font-bold text-xl
                      ${
                        card.type === "spanish"
                          ? "bg-purple-700 border-purple-500"
                          : "bg-orange-700 border-orange-500"
                      }
                      ${
                        card.isMatched
                          ? "ring-2 ring-green-400 ring-opacity-50"
                          : ""
                      }
                      ${isFlipped || card.isMatched ? "" : "backface-hidden"}
                      bg-gradient-to-br ${
                        card.type === "spanish"
                          ? "from-purple-600 to-purple-800"
                          : "from-orange-600 to-orange-800"
                      }`}
          style={{ transform: "rotateY(180deg)" }}
        >
          {card.content}
        </div>
      </motion.div>
    </div>
  );
};

export default Card;
