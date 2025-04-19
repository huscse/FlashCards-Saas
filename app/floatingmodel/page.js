'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

const FloatingFlashcardModel = () => {
  // Refs for the container and animation frame
  const containerRef = useRef(null);
  const requestRef = useRef(null);

  // State for mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Sample flashcard data
  const flashcards = [
    {
      question: 'What is the capital of France?',
      answer: 'Paris',
      color: 'rgba(108, 99, 255, 0.9)',
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      answer: 'William Shakespeare',
      color: 'rgba(99, 236, 255, 0.9)',
    },
    {
      question: 'What is the chemical symbol for gold?',
      answer: 'Au',
      color: 'rgba(255, 157, 165, 0.9)',
    },
  ];

  // State for card rotation
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate mouse position relative to center
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);

    setMousePosition({ x: relativeX, y: relativeY });
  };

  // Animation loop
  const animate = () => {
    // Smoothly interpolate rotation
    const rotX = -mousePosition.y * 10; // Inverse Y for natural tilt
    const rotY = mousePosition.x * 10;

    setRotation({
      x: rotX,
      y: rotY,
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  // Set up and clean up animation frame
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePosition]);

  // Handle touch capability
  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      // For touch devices, use a simpler animation
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
        height: { xs: '300px', md: '500px' },
        perspective: '1200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Glow effect under cards */}
      <Box
        sx={{
          position: 'absolute',
          width: '60%',
          height: '50%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(108, 99, 255, 0.4) 0%, rgba(99, 236, 255, 0.2) 50%, transparent 80%)',
          filter: 'blur(40px)',
          opacity: isHovering ? 0.8 : 0.5,
          transition: 'opacity 0.5s ease',
          transform: 'translateY(20%)',
        }}
      />

      {/* Flashcards stack */}
      {flashcards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: rotation.x,
            rotateY: rotation.y,
            z: -index * 10, // Stack the cards
            translateZ: isHovering ? -index * 40 : -index * 20, // Space out cards on hover
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            delay: index * 0.1,
          }}
          style={{
            position: 'absolute',
            width: `calc(100% - ${index * 20}px)`,
            maxWidth: '460px',
            height: `calc(280px - ${index * 5}px)`,
            borderRadius: '16px',
            backgroundColor: card.color,
            boxShadow:
              '0px 30px 60px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            transformStyle: 'preserve-3d',
            transform: `translateY(${-index * 10}px) rotateX(${
              rotation.x
            }deg) rotateY(${rotation.y}deg)`,
            zIndex: flashcards.length - index,
            overflow: 'hidden',
          }}
        >
          {/* Card content */}
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Question side */}
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.7rem',
                  letterSpacing: '1px',
                }}
              >
                QUESTION
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  mt: 1,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                }}
              >
                {card.question}
              </Typography>
            </Box>

            {/* Divider */}
            <Box
              sx={{
                width: '100%',
                height: '1px',
                background: 'rgba(255, 255, 255, 0.2)',
                my: 2,
              }}
            />

            {/* Answer side */}
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.7rem',
                  letterSpacing: '1px',
                }}
              >
                ANSWER
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  mt: 1,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                {card.answer}
              </Typography>
            </Box>
          </Box>

          {/* Glass reflection effect */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '30%',
              background:
                'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent)',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            }}
          />

          {/* Card logo/brand */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              opacity: 0.5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 600,
                letterSpacing: '1px',
                fontSize: { xs: '0.6rem', md: '0.7rem' },
                opacity: 0.7,
              }}
            >
              PromptWise
            </Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

export default FloatingFlashcardModel;
