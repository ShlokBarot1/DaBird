"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Moon, Sun, RotateCcw, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';
import { siteImages } from '../../lib/siteImages';

interface Card {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  link: string;
  isExternal?: boolean;
}

export default function CardStack() {
  const initialCards: Card[] = [
    {
      id: 1,
      src: siteImages.homeOurProducts,
      alt: "Our Products",
      title: "OUR PRODUCTS",
      description: "COLLECTION 01 & 02",
      link: "#shop"
    },
    {
      id: 2,
      src: siteImages.homeOurStory,
      alt: "Our Story",
      title: "OUR STORY",
      description: "ABOUT US",
      link: "#about"
    },
    {
      id: 3,
      src: siteImages.homeJoinFlock,
      alt: "Join the Flock",
      title: "JOIN THE FLOCK",
      description: "INSTAGRAM",
      link: "https://www.instagram.com/dabirddotnet?igsh=MWZubXdsd2FkZ3JlZA==",
      isExternal: true
    }
  ];

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [dragDirection, setDragDirection] = useState<'up' | 'down' | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const dragY = useMotionValue(0);
  const rotateX = useTransform(dragY, [-200, 0, 200], [15, 0, -15]);

  // Configuration
  const offset = 12; // Percentage to push cards upwards
  const scaleStep = 0.08;
  const dimStep = 0.15;
  const stiff = 170;
  const damp = 26;
  const borderRadius = 20;

  const spring = {
    type: 'spring' as const,
    stiffness: stiff,
    damping: damp
  };

  const moveToEnd = () => {
    setCards(prev => [...prev.slice(1), prev[0]]);
    setCurrentIndex((prev) => (prev + 1) % initialCards.length);
  };

  const moveToStart = () => {
    setCards(prev => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    setCurrentIndex((prev) => (prev - 1 + initialCards.length) % initialCards.length);
  };

  // Auto-play transition
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDragDirection('up');
      setTimeout(() => {
        moveToEnd();
        setDragDirection(null);
      }, 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = () => {
    const activeCard = cards[0];
    if (activeCard.isExternal) {
      window.open(activeCard.link, "_blank", "noopener noreferrer");
    } else {
      window.location.hash = activeCard.link;
    }
  };

  const currentTheme = {
    bg: 'bg-transparent',
    text: 'text-[#1F3A4B]',
    textSecondary: 'text-gray-600',
    toggleBg: 'bg-white hover:bg-gray-100',
    toggleBorder: 'border-gray-300',
    infoBox: 'bg-white/90 border-gray-300',
    shadowCard: '0 30px 60px rgba(0,0,0,0.2)',
    shadowCardBack: '0 15px 30px rgba(0, 0, 0, 0.1)',
    cardBorder: 'border border-gray-200',
    controlBg: 'bg-white/80 hover:bg-gray-100',
    cardInfoBg: 'bg-gradient-to-t from-black/80 to-transparent'
  };

  return (
    <div className={`w-full h-auto py-32 flex flex-col items-center justify-center ${currentTheme.bg} transition-all duration-500 relative overflow-visible`}>

      {/* Navigation Buttons */}
      <motion.button
        onClick={moveToStart}
        className={`absolute left-4 md:left-12 top-1/2 -translate-y-1/2 p-4 rounded-full ${currentTheme.controlBg} shadow-md border ${currentTheme.toggleBorder} backdrop-blur-sm transition-colors duration-200 z-20`}
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className={`w-8 h-8 ${currentTheme.text}`} />
      </motion.button>

      <motion.button
        onClick={moveToEnd}
        className={`absolute right-4 md:right-12 top-1/2 -translate-y-1/2 p-4 rounded-full ${currentTheme.controlBg} shadow-md border ${currentTheme.toggleBorder} backdrop-blur-sm transition-colors duration-200 z-20`}
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className={`w-8 h-8 ${currentTheme.text}`} />
      </motion.button>

      {/* Card Stack Container */}
      <div className="relative w-[90vw] md:w-[80vw] max-w-[1400px] h-[60vh] md:h-[75vh] min-h-[500px] overflow-visible z-10 perspective-1000">
        <ul className="relative w-full h-full m-0 p-0">
          <AnimatePresence>
            {cards.map(({ id, src, alt, title, description }, i) => {
              const isFront = i === 0;
              const brightness = Math.max(0.4, 1 - i * dimStep);
              const baseZ = cards.length - i;

              return (
                <motion.li
                  key={id}
                  className={`absolute w-full h-full list-none overflow-hidden ${currentTheme.cardBorder}`}
                  style={{
                    borderRadius: `${borderRadius}px`,
                    cursor: isFront ? 'grab' : 'auto',
                    touchAction: 'none',
                    boxShadow: isFront
                      ? currentTheme.shadowCard
                      : currentTheme.shadowCardBack,
                    transformOrigin: 'top center'
                  }}
                  animate={{
                    y: `${i * -offset}%`,
                    scale: 1 - i * scaleStep,
                    filter: `brightness(${brightness})`,
                    zIndex: baseZ,
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.2 }
                  }}
                  transition={spring}
                  onClick={() => isFront && handleCardClick()}
                  onHoverStart={() => isFront && setShowInfo(true)}
                  onHoverEnd={() => setShowInfo(false)}
                >
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover pointer-events-none select-none bg-gray-200"
                    draggable={false}
                  />
                  
                  {/* Card Info Overlay */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 p-8 ${currentTheme.cardInfoBg}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: isFront && showInfo ? 1 : 0,
                      y: isFront && showInfo ? 0 : 20
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-white font-extrabold text-3xl md:text-5xl uppercase tracking-wider mb-2">{title}</h3>
                    <p className="text-white/90 text-lg md:text-xl font-medium tracking-wide uppercase">{description}</p>
                  </motion.div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-20 md:top-16 left-1/2 -translate-x-1/2 flex gap-3 z-30 pointer-events-none">
        {initialCards.map((_, i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex % initialCards.length
                ? `bg-blue-600 w-12`
                : `bg-gray-300 w-3`
            }`}
          />
        ))}
      </div>
    </div>
  );
}
