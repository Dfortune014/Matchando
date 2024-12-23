import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Star } from "lucide-react"; // Import icons from lucide-react

interface GameHeaderProps {
  matches: number;
  totalPairs: number;
  timer: number;
  score: number; // Ensure score is typed
}

const GameHeader: React.FC<GameHeaderProps> = ({
  matches,
  totalPairs,
  timer,
  score,
}) => {
  return (
    <motion.div
      className="text-center py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider">
        Language Match
      </h1>
      <div className="flex justify-center items-center space-x-4 text-xl text-primary-foreground/80">
        <div className="flex items-center">
          <CheckCircle className="h-6 w-6 mr-1" />
          <span>
            {matches}/{totalPairs}
          </span>
        </div>
        <div className="flex items-center">
          <Star className="h-6 w-6 mr-1" />
          <span>Score: {score}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-6 w-6 mr-1" />
          <span>Time Remaining: {timer}s</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GameHeader;
