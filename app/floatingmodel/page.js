'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

const FloatingFlashcardModel = () => {
  const containerRef = useRef(null);
  const requestRef = useRef(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Sample flashcard data with brutalist styling
  const flashcards = [
    {
      question: 'What is AI?',
      answer: 'Artificial Intelligence',
      frontColor: '#1E1E1E',
      backColor: '#FF2D55',
    },
    {
      question: 'Machine Learning?',
      answer: 'Algorithms that learn from data',
      frontColor: '#FF2D55',
      backColor: '#1E1E1E',
    },
    {
      question: 'Neural Networks?',
      answer: 'Brain-inspired computing systems',
      frontColor: '#1E1E1E',
      backColor: '#FF2D55',
    },
  ];

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);

    setMousePosition({ x: relativeX, y: relativeY });
  };

  const animate = () => {
    const rotX = -mousePosition.y * 8;
    const rotY = mousePosition.x * 8;

    setRotation({
      x: rotX,
      y: rotY,
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePosition]);

  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      cancelAnimationFrame(requestRef.current);
      setRotation({ x: 0, y: 0 });
    }
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        perspective: '1500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Geometric background elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          border: '3px solid rgba(255, 45, 85, 0.2)',
          transform: 'rotate(45deg)',
          top: '10%',
          left: '5%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          backgroundColor: 'rgba(232, 244, 255, 0.3)',
          transform: 'rotate(-15deg)',
          bottom: '15%',
          right: '10%',
          zIndex: 0,
        }}
      />

      {/* Flashcards stack */}
      {flashcards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40, rotateZ: index * 5 }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: rotation.x,
            rotateY: rotation.y,
            rotateZ: isHovering ? index * 8 : index * 3,
            z: -index * 15,
            translateX: isHovering ? index * 15 : index * 8,
            translateY: isHovering ? -index * 15 : -index * 8,
          }}
          transition={{
            type: 'spring',
            stiffness: 80,
            damping: 15,
            delay: index * 0.15,
          }}
          style={{
            position: 'absolute',
            width: `calc(90% - ${index * 10}px)`,
            maxWidth: '400px',
            height: `calc(240px - ${index * 8}px)`,
            border: '4px solid #1E1E1E',
            backgroundColor: card.frontColor,
            boxShadow: `${8 + index * 2}px ${8 + index * 2}px 0 #1E1E1E`,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            transformStyle: 'preserve-3d',
            zIndex: flashcards.length - index,
            overflow: 'hidden',
          }}
        >
          {/* Question Label */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              px: 2,
              py: 0.5,
              backgroundColor:
                card.frontColor === '#1E1E1E' ? '#FF2D55' : '#1E1E1E',
              border: '2px solid #1E1E1E',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 700,
                letterSpacing: '0.15em',
                fontSize: '0.6rem',
                color: '#FFFEF2',
              }}
            >
              Q
            </Typography>
          </Box>

          {/* Card Number */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: '32px',
              height: '32px',
              backgroundColor:
                card.frontColor === '#1E1E1E' ? '#FFFEF2' : '#1E1E1E',
              border: '2px solid #1E1E1E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 900,
                fontSize: '0.9rem',
                color: card.frontColor === '#1E1E1E' ? '#1E1E1E' : '#FFFEF2',
              }}
            >
              {index + 1}
            </Typography>
          </Box>

          {/* Question Content */}
          <Box
            sx={{
              height: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                color: card.frontColor === '#1E1E1E' ? '#FFFEF2' : '#1E1E1E',
                fontWeight: 600,
                textAlign: 'center',
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                lineHeight: 1.4,
              }}
            >
              {card.question}
            </Typography>
          </Box>

          {/* Divider Line - Brutalist style */}
          <Box
            sx={{
              width: '100%',
              height: '3px',
              backgroundColor:
                card.frontColor === '#1E1E1E' ? '#FF2D55' : '#1E1E1E',
              my: 2,
            }}
          />

          {/* Answer Label */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              px: 2,
              py: 0.5,
              backgroundColor: card.backColor,
              border: '2px solid #1E1E1E',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 700,
                letterSpacing: '0.15em',
                fontSize: '0.6rem',
                color: '#FFFEF2',
              }}
            >
              A
            </Typography>
          </Box>

          {/* Answer Content */}
          <Box
            sx={{
              height: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                color: card.frontColor === '#1E1E1E' ? '#FFFEF2' : '#1E1E1E',
                textAlign: 'center',
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              {card.answer}
            </Typography>
          </Box>

          {/* Brand Mark */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 900,
                letterSpacing: '0.05em',
                fontSize: '0.55rem',
                color:
                  card.frontColor === '#1E1E1E'
                    ? 'rgba(255, 254, 242, 0.3)'
                    : 'rgba(30, 30, 30, 0.3)',
              }}
            >
              PROMPTWISE
            </Typography>
          </Box>

          {/* Decorative corner elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -2,
              left: -2,
              width: '20px',
              height: '20px',
              borderTop: '4px solid #FF2D55',
              borderLeft: '4px solid #FF2D55',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: '20px',
              height: '20px',
              borderBottom: '4px solid #FF2D55',
              borderRight: '4px solid #FF2D55',
            }}
          />
        </motion.div>
      ))}

      {/* Floating "AI" badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -10, 0],
        }}
        transition={{
          scale: { delay: 0.5, duration: 0.3 },
          y: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        style={{
          position: 'absolute',
          top: '-5%',
          right: '-5%',
          width: '80px',
          height: '80px',
          backgroundColor: '#FF2D55',
          border: '4px solid #1E1E1E',
          boxShadow: '6px 6px 0 #1E1E1E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 900,
            color: '#FFFEF2',
            fontSize: '1.8rem',
          }}
        >
          AI
        </Typography>
      </motion.div>

      {/* Rotating border decoration */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          border: '2px solid rgba(255, 45, 85, 0.15)',
          borderRadius: '50%',
          zIndex: -1,
        }}
      />
    </Box>
  );
};

export default FloatingFlashcardModel;
