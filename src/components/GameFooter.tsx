import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface GameFooterProps {
  onRestart: () => void;
  matches: number;
  totalPairs: number;
}

const GameFooter: React.FC<GameFooterProps> = ({ onRestart, matches, totalPairs }) => {
  const messages = [
    "The quest begins! 🗡️",
    "Your magic grows stronger! ✨",
    "Almost there, brave one! 🛡️",
    "Victory awaits! 🏆"
  ];

  const currentMessage = messages[Math.min(Math.floor((matches / totalPairs) * messages.length), messages.length - 1)];

  return (
    <motion.div
      className="text-center py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-lg text-primary-foreground/80 mb-4">{currentMessage}</p>
      <Button
        onClick={onRestart}
        className="bg-primary hover:bg-primary/80 text-white px-8 py-2 rounded-lg transition-colors border border-primary/20"
      >
        New Game
      </Button>
    </motion.div>
  );
};

export default GameFooter;