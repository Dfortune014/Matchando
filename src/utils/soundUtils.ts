// src/utils/soundUtils.ts
export const playSound = (sound: string) => {
  const audio = new Audio(sound);
  audio.play().catch((error) => console.error("Error playing sound:", error));
};
