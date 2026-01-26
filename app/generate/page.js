'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
  query,
  where,
  addDoc,
} from 'firebase/firestore';
import { db } from '/firebase';
import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Analytics } from '@vercel/analytics/react';
import {
  CssBaseline,
  Container,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack,
  AutoFixHigh,
  ColorLens,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';
import { SignedIn, UserButton } from '@clerk/nextjs';

// Brutalist-swiss theme matching the landing page
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF2D55',
      contrastText: '#FFFEF2',
    },
    secondary: {
      main: '#1E1E1E',
    },
    background: {
      default: '#FFFEF2',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1E1E',
      secondary: '#6B6B6B',
    },
  },
  typography: {
    fontFamily: "'Archivo', 'Helvetica Neue', sans-serif",
    h1: {
      fontFamily: "'Unbounded', 'Arial Black', sans-serif",
      fontWeight: 800,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontFamily: "'Unbounded', 'Arial Black', sans-serif",
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontFamily: "'Unbounded', 'Arial Black', sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: "'Archivo', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 500,
    },
    body1: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontSize: '1.05rem',
      lineHeight: 1.7,
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.1em',
          padding: '12px 24px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '3px solid #1E1E1E',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              borderWidth: '2px',
              borderColor: '#1E1E1E',
            },
            '&:hover fieldset': {
              borderColor: '#FF2D55',
              borderWidth: '2px',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF2D55',
              borderWidth: '3px',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: '4px solid #1E1E1E',
          boxShadow: '8px 8px 0 #1E1E1E',
        },
      },
    },
  },
});

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [frontColor, setFrontColor] = useState('#1E1E1E');
  const [backColor, setBackColor] = useState('#FF2D55');
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Pre-defined prompt templates
  const promptTemplates = [
    {
      name: 'Biology',
      text: 'Create flashcards for these biology concepts: photosynthesis, cellular respiration, mitosis, meiosis',
      icon: '🧬',
    },
    {
      name: 'Spanish',
      text: 'Create vocabulary flashcards for these Spanish terms: hola, adiós, por favor, gracias, buenos días',
      icon: '🇪🇸',
    },
    {
      name: 'Math',
      text: 'Create flashcards for these mathematical formulas: quadratic formula, pythagorean theorem, area of a circle',
      icon: '📐',
    },
    {
      name: 'History',
      text: 'Create flashcards for these historical events: Declaration of Independence, World War I, Fall of the Berlin Wall',
      icon: '📜',
    },
  ];

  useEffect(() => {
    if (db) {
      console.log('Firestore database object is available');
      setFirebaseInitialized(true);
    } else {
      console.error('Firestore database object is not available');
    }
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ text, frontColor, backColor }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await res.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('An error occurred while generating flashcards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTemplateClick = (template) => {
    setText(template.text);
  };

  const saveFlashcards = async () => {
    if (!isSignedIn || !user) {
      alert('You must be signed in to save flashcards.');
      return;
    }

    if (!name) {
      alert('Please enter a name');
      return;
    }

    try {
      const response = await fetch('/api/save-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          cards: flashcards,
          frontColor,
          backColor,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      alert('Flashcards saved successfully!');
      handleClose();
      setName('');
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert(`Error saving flashcards: ${error.message}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Generate Flashcards | PromptWise</title>
        <meta
          name="description"
          content="Create AI-powered flashcards from any prompt"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800;900&family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        ::selection {
          background: #ff2d55;
          color: #fffef2;
        }

        .noise {
          position: fixed;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          width: 200%;
          height: 200vh;
          background: transparent
            url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')
            repeat;
          pointer-events: none;
          opacity: 0.4;
          z-index: 1000;
        }
      `}</style>

      <Analytics />
      <CssBaseline />
      <Box className="noise" />

      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: '#FFFEF2',
          borderBottom: '3px solid #1E1E1E',
        }}
      >
        <Toolbar sx={{ py: 2, px: { xs: 2, md: 4 } }}>
          <IconButton
            component={Link}
            href="/"
            edge="start"
            sx={{
              mr: 2,
              border: '2px solid #1E1E1E',
              borderRadius: 0,
              color: '#1E1E1E',
              '&:hover': {
                backgroundColor: '#1E1E1E',
                color: '#FFFEF2',
              },
            }}
          >
            <ArrowBack />
          </IconButton>

          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 900,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              color: '#1E1E1E',
            }}
          >
            PROMPTWISE
          </Typography>

          <SignedIn>
            <Button
              component={Link}
              href="/flashcards"
              variant="outlined"
              sx={{
                mr: 2,
                border: '2px solid #1E1E1E',
                color: '#1E1E1E',
                '&:hover': {
                  backgroundColor: '#1E1E1E',
                  color: '#FFFEF2',
                  border: '2px solid #1E1E1E',
                },
              }}
            >
              MY FLASHCARDS
            </Button>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: '100vh',
          pt: { xs: 10, md: 12 },
          pb: 8,
          position: 'relative',
        }}
      >
        {/* Geometric background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: '300px',
            height: '300px',
            border: '3px solid rgba(255, 45, 85, 0.1)',
            transform: 'rotate(12deg)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '3%',
            width: '250px',
            height: '250px',
            backgroundColor: 'rgba(232, 244, 255, 0.3)',
            transform: 'rotate(-8deg)',
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-block',
                  border: '2px solid #1E1E1E',
                  px: 3,
                  py: 1,
                  mb: 3,
                  backgroundColor: '#FFF',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    fontSize: '0.75rem',
                    color: '#FF2D55',
                  }}
                >
                  AI GENERATOR
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  mb: 3,
                  lineHeight: 1,
                }}
              >
                CREATE
                <br />
                <Box
                  component="span"
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '10%',
                      left: '-4%',
                      right: '-4%',
                      height: '30%',
                      background: '#FF2D55',
                      zIndex: -1,
                    }}
                  />
                  FLASHCARDS
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontWeight: 400,
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                Transform any topic into structured learning materials with AI
              </Typography>
            </Box>

            {/* Main Input Section */}
            <Box
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                mb: 8,
              }}
            >
              <Paper
                sx={{
                  p: { xs: 3, md: 5 },
                  border: '4px solid #1E1E1E',
                  backgroundColor: '#FFF',
                  boxShadow: '8px 8px 0 #1E1E1E',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    fontFamily: "'Unbounded', sans-serif",
                    fontSize: '1.3rem',
                  }}
                >
                  WHAT TO LEARN?
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    color: 'text.secondary',
                  }}
                >
                  Describe what you want to study. Be specific about concepts,
                  terms, or topics.
                </Typography>

                {/* Template chips */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Quick Start Templates
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {promptTemplates.map((template, index) => (
                      <Box
                        key={index}
                        component={motion.div}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTemplateClick(template)}
                        sx={{
                          border: '2px solid #1E1E1E',
                          px: 2,
                          py: 1,
                          backgroundColor: '#FFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: '#1E1E1E',
                            color: '#FFFEF2',
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                          }}
                        >
                          {template.icon} {template.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <TextField
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your prompt here..."
                  fullWidth
                  multiline
                  rows={5}
                  variant="outlined"
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#FFFEF2',
                      fontFamily: "'IBM Plex Sans', sans-serif",
                    },
                  }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  fullWidth
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} sx={{ color: '#FFFEF2' }} />
                    ) : (
                      <AutoFixHigh />
                    )
                  }
                  sx={{
                    py: 1.5,
                    boxShadow: '6px 6px 0 #1E1E1E',
                    '&:hover': {
                      transform: 'translate(3px, 3px)',
                      boxShadow: '3px 3px 0 #1E1E1E',
                    },
                    transition: 'all 0.2s',
                    '&:disabled': {
                      backgroundColor: '#6B6B6B',
                      color: '#FFFEF2',
                    },
                  }}
                >
                  {isLoading ? 'GENERATING...' : 'GENERATE FLASHCARDS'}
                </Button>
              </Paper>
            </Box>

            {/* Flashcards Preview Section */}
            <AnimatePresence>
              {flashcards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Box sx={{ mb: 6 }}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        border: '2px solid #1E1E1E',
                        px: 3,
                        py: 1,
                        mb: 3,
                        backgroundColor: '#FFF',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          letterSpacing: '0.15em',
                          fontSize: '0.75rem',
                        }}
                      >
                        {flashcards.length} CARDS GENERATED
                      </Typography>
                    </Box>

                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: '2rem', md: '3rem' },
                        mb: 2,
                      }}
                    >
                      YOUR FLASHCARDS
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        mb: 4,
                      }}
                    >
                      Click any card to flip and reveal the answer
                    </Typography>
                  </Box>

                  {/* Color Customization */}
                  <Paper
                    sx={{
                      p: 4,
                      mb: 6,
                      maxWidth: '600px',
                      mx: 'auto',
                      border: '3px solid #1E1E1E',
                      backgroundColor: '#E8F4FF',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <ColorLens /> CUSTOMIZE COLORS
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            border: '2px solid #1E1E1E',
                            p: 2,
                            backgroundColor: '#FFF',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              fontSize: '0.7rem',
                              mb: 1,
                              display: 'block',
                            }}
                          >
                            FRONT COLOR
                          </Typography>
                          <input
                            type="color"
                            value={frontColor}
                            onChange={(e) => setFrontColor(e.target.value)}
                            style={{
                              width: '100%',
                              height: '50px',
                              border: '2px solid #1E1E1E',
                              cursor: 'pointer',
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            border: '2px solid #1E1E1E',
                            p: 2,
                            backgroundColor: '#FFF',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              fontSize: '0.7rem',
                              mb: 1,
                              display: 'block',
                            }}
                          >
                            BACK COLOR
                          </Typography>
                          <input
                            type="color"
                            value={backColor}
                            onChange={(e) => setBackColor(e.target.value)}
                            style={{
                              width: '100%',
                              height: '50px',
                              border: '2px solid #1E1E1E',
                              cursor: 'pointer',
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Flashcards Grid */}
                  <Grid container spacing={3} sx={{ mb: 6 }}>
                    {flashcards.map((flashcard, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <Card
                            sx={{
                              backgroundColor: '#FFF',
                              boxShadow: '6px 6px 0 #1E1E1E',
                              transition: 'all 0.3s',
                              cursor: 'pointer',
                              '&:hover': {
                                boxShadow: '3px 3px 0 #1E1E1E',
                                transform: 'translate(3px, 3px)',
                              },
                            }}
                          >
                            <CardActionArea
                              onClick={() => handleCardClick(index)}
                            >
                              <CardContent sx={{ p: 0 }}>
                                <Box
                                  sx={{
                                    perspective: '1000px',
                                    height: '250px',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      position: 'relative',
                                      width: '100%',
                                      height: '100%',
                                      transition: 'transform 0.6s',
                                      transformStyle: 'preserve-3d',
                                      transform: flipped[index]
                                        ? 'rotateY(180deg)'
                                        : 'rotateY(0deg)',
                                    }}
                                  >
                                    {/* Front */}
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 3,
                                        backgroundColor: frontColor,
                                        color: '#FFFEF2',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          position: 'absolute',
                                          top: 12,
                                          left: 12,
                                          px: 2,
                                          py: 0.5,
                                          backgroundColor: '#FF2D55',
                                          border: '2px solid #1E1E1E',
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontWeight: 700,
                                            letterSpacing: '0.1em',
                                            fontSize: '0.6rem',
                                            color: '#FFFEF2',
                                          }}
                                        >
                                          Q
                                        </Typography>
                                      </Box>
                                      <Typography
                                        variant="h6"
                                        sx={{
                                          textAlign: 'center',
                                          fontFamily:
                                            "'IBM Plex Sans', sans-serif",
                                          fontWeight: 600,
                                          fontSize: '1.1rem',
                                        }}
                                      >
                                        {flashcard.front}
                                      </Typography>
                                    </Box>

                                    {/* Back */}
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 3,
                                        backgroundColor: backColor,
                                        color: '#FFFEF2',
                                        transform: 'rotateY(180deg)',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          position: 'absolute',
                                          top: 12,
                                          left: 12,
                                          px: 2,
                                          py: 0.5,
                                          backgroundColor: '#1E1E1E',
                                          border: '2px solid #FFFEF2',
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontWeight: 700,
                                            letterSpacing: '0.1em',
                                            fontSize: '0.6rem',
                                            color: '#FFFEF2',
                                          }}
                                        >
                                          A
                                        </Typography>
                                      </Box>
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          textAlign: 'center',
                                          fontFamily:
                                            "'IBM Plex Sans', sans-serif",
                                          fontWeight: 500,
                                          fontSize: '1rem',
                                        }}
                                      >
                                        {flashcard.back}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Save Button */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<SaveIcon />}
                      onClick={handleOpen}
                      sx={{
                        py: 2,
                        px: 6,
                        boxShadow: '6px 6px 0 #1E1E1E',
                        fontSize: '1rem',
                        '&:hover': {
                          transform: 'translate(3px, 3px)',
                          boxShadow: '3px 3px 0 #1E1E1E',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      SAVE FLASHCARDS
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Container>
      </Box>

      {/* Save Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 700,
            }}
          >
            SAVE COLLECTION
          </Typography>
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 3, color: 'text.secondary' }}>
            Give your flashcard collection a name to find it easily later.
          </DialogContentText>

          <TextField
            autoFocus
            label="Collection Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Biology Chapter 5"
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              border: '2px solid #1E1E1E',
              color: '#1E1E1E',
              '&:hover': {
                backgroundColor: '#1E1E1E',
                color: '#FFFEF2',
                border: '2px solid #1E1E1E',
              },
            }}
          >
            CANCEL
          </Button>

          <Button
            onClick={saveFlashcards}
            variant="contained"
            color="primary"
            sx={{
              boxShadow: '4px 4px 0 #1E1E1E',
              '&:hover': {
                transform: 'translate(2px, 2px)',
                boxShadow: '2px 2px 0 #1E1E1E',
              },
              transition: 'all 0.2s',
            }}
          >
            SAVE
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
