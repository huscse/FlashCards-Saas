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
  Divider,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  Lightbulb,
  Save as SaveIcon,
  ArrowBack,
  AutoFixHigh,
  ColorLens,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';
import { SignedIn, UserButton } from '@clerk/nextjs';

// Updated theme to match the homepage styling
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF', // Modern purple
    },
    secondary: {
      main: '#63ECFF', // Cyan accent
    },
    background: {
      default: '#0A0E17', // Deep navy
      paper: '#141B2D', // Slightly lighter navy
    },
    text: {
      primary: '#ffffff',
      secondary: '#B8C7E0', // Soft blue-ish white
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
        },
        containedPrimary: {
          boxShadow: '0 4px 14px 0 rgba(108, 99, 255, 0.39)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#141B2D',
          backgroundImage: 'none',
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
  const [frontColor, setFrontColor] = useState('#6C63FF');
  const [backColor, setBackColor] = useState('#63ECFF');
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'));

  // Pre-defined prompt templates
  const promptTemplates = [
    {
      name: 'Key Concepts',
      text: 'Create flashcards for the following key concepts in biology: photosynthesis, cellular respiration, mitosis, meiosis',
    },
    {
      name: 'Vocabulary',
      text: 'Create vocabulary flashcards for these Spanish terms: hola, adiós, por favor, gracias, buenos días',
    },
    {
      name: 'Formulas',
      text: 'Create flashcards for these mathematical formulas: quadratic formula, pythagorean theorem, area of a circle, volume of a sphere',
    },
    {
      name: 'Dates & Events',
      text: 'Create flashcards for these historical dates and events: Declaration of Independence, World War I, Fall of the Berlin Wall',
    },
  ];

  // Check if Firebase is properly initialized
  useEffect(() => {
    // Simple check to see if db is available
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

  // Add this function to your component
  const handleTemplateClick = (template) => {
    // Set the text input to the template's text content
    setText(template.text);
  };

  // Fixed saveFlashcards function
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

      const data = await response.json(); // ✅ Make sure to define `data`

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      alert('Flashcards saved successfully!');
      // You can also redirect or clear form state here
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert(`Error saving flashcards: ${error.message}`);
    }
  };

  // Example of how to read flashcards with the new structure
  const loadFlashcards = async () => {
    if (!isSignedIn || !user) return;

    try {
      const q = query(
        collection(db, 'flashcard_collections'),
        where('userId', '==', user.id),
      );

      const querySnapshot = await getDocs(q);
      const collections = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        collections.push({
          id: doc.id,
          name: data.name,
          cards: data.cards || [],
          createdAt: data.createdAt,
        });
      });

      return collections;
    } catch (error) {
      console.error('Error loading flashcards:', error);
      return [];
    }
  };

  // Background gradient style
  const gradientBgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'radial-gradient(circle at 30% 50%, rgba(108, 99, 255, 0.08), transparent 40%), radial-gradient(circle at 70% 20%, rgba(99, 236, 255, 0.05), transparent 30%)',
    zIndex: 0,
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Head>
        <title>Generate Flashcards | PromptWise</title>
        <meta
          name="description"
          content="Create AI-powered flashcards from any prompt"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Analytics />
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'rgba(10, 14, 23, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 6 } }}>
          <IconButton
            component={Link}
            href="/"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #6C63FF, #63ECFF)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PromptWise
          </Typography>

          <SignedIn>
            <Button
              color="inherit"
              component={Link}
              href="/flashcards"
              sx={{
                mr: 2,
                '&:hover': {
                  backgroundColor: 'rgba(108, 99, 255, 0.1)',
                },
              }}
            >
              My Flashcards
            </Button>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          background: '#0A0E17',
          position: 'relative',
          pb: 8,
        }}
      >
        {/* Background gradient */}
        <Box sx={gradientBgStyle} />

        <Container
          maxWidth="lg"
          sx={{ position: 'relative', zIndex: 1, pt: 4 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                fontWeight: 700,
                mb: 4,
                background: 'linear-gradient(90deg, #fff, #B8C7E0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Create Your Flashcards
            </Typography>

            {/* Prompt Input Section */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>
                <Paper
                  sx={{
                    p: { xs: 3, md: 4 },
                    background: 'rgba(20, 27, 45, 0.7)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative glow effect */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-10%',
                      width: '120%',
                      height: '150%',
                      background:
                        'radial-gradient(ellipse at center, rgba(108, 99, 255, 0.15) 0%, transparent 70%)',
                      opacity: 0.5,
                      zIndex: 0,
                    }}
                  />

                  <Box position="relative" zIndex={1}>
                    <Typography variant="h5" mb={3} sx={{ fontWeight: 600 }}>
                      What would you like to learn?
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={3}>
                      Enter a prompt describing what you want to create
                      flashcards about. Be specific about the subject, concepts,
                      or terms you want to learn.
                    </Typography>

                    {/* Template chips */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        mb={1}
                      >
                        Try a template:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {promptTemplates.map((template, index) => (
                          <Chip
                            key={index}
                            label={template.name}
                            onClick={() => handleTemplateClick(template)}
                            sx={{
                              backgroundColor: 'rgba(108, 99, 255, 0.2)',
                              '&:hover': {
                                backgroundColor: 'rgba(108, 99, 255, 0.3)',
                              },
                              mb: 1,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <TextField
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      label="Type your prompt here..."
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          backgroundColor: 'rgba(10, 14, 23, 0.5)',
                          borderRadius: '12px',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6C63FF',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6C63FF',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: 'text.secondary',
                        },
                      }}
                      sx={{ mb: 3 }}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      fullWidth
                      disabled={isLoading}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <AutoFixHigh />
                        )
                      }
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(90deg, #6C63FF, #8A83FF)',
                        boxShadow: '0px 4px 15px rgba(108, 99, 255, 0.3)',
                        '&:hover': {
                          background:
                            'linear-gradient(90deg, #5A52FF, #6C63FF)',
                          boxShadow: '0px 4px 20px rgba(108, 99, 255, 0.5)',
                        },
                      }}
                    >
                      {isLoading ? 'Generating...' : 'Generate Flashcards'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Flashcards Preview Section */}
            {flashcards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Box sx={{ mt: 8 }}>
                  <Typography
                    variant="h4"
                    align="center"
                    mb={2}
                    sx={{
                      fontWeight: 600,
                      background: 'linear-gradient(90deg, #fff, #B8C7E0)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Your Flashcards
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                    mb={4}
                  >
                    Click on a card to flip it and see the answer
                  </Typography>

                  {/* Color selection */}
                  <Paper
                    sx={{
                      p: 3,
                      mb: 4,
                      mx: 'auto',
                      maxWidth: '600px',
                      background: 'rgba(20, 27, 45, 0.6)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Typography
                      variant="h6"
                      mb={2}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <ColorLens /> Customize Colors
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Front Color"
                          type="color"
                          value={frontColor}
                          onChange={(e) => setFrontColor(e.target.value)}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              p: 1,
                              height: 40,
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Back Color"
                          type="color"
                          value={backColor}
                          onChange={(e) => setBackColor(e.target.value)}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              p: 1,
                              height: 40,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Flashcards grid */}
                  <Grid container spacing={3}>
                    {flashcards.map((flashcard, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{
                            y: -10,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <Card
                            sx={{
                              background: 'rgba(20, 27, 45, 0.4)',
                              backdropFilter: 'blur(16px)',
                              borderRadius: '16px',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                              overflow: 'visible',
                            }}
                          >
                            <CardActionArea
                              onClick={() => handleCardClick(index)}
                              sx={{ height: '100%' }}
                            >
                              <CardContent>
                                <Box
                                  sx={{
                                    perspective: '1000px',
                                    height: 200,
                                    '& > div': {
                                      transition: 'transform 0.6s',
                                      transformStyle: 'preserve-3d',
                                      position: 'relative',
                                      width: '100%',
                                      height: '100%',
                                      transform: flipped[index]
                                        ? 'rotateY(180deg)'
                                        : 'rotateY(0deg)',
                                    },
                                    '& > div > div': {
                                      position: 'absolute',
                                      width: '100%',
                                      height: '100%',
                                      backfaceVisibility: 'hidden',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      padding: 2,
                                      boxSizing: 'border-box',
                                      borderRadius: '12px',
                                      overflow: 'auto',
                                    },
                                    '& > div > div:nth-of-type(1)': {
                                      backgroundColor: frontColor,
                                      color: '#ffffff',
                                    },
                                    '& > div > div:nth-of-type(2)': {
                                      backgroundColor: backColor,
                                      color: '#ffffff',
                                      transform: 'rotateY(180deg)',
                                    },
                                  }}
                                >
                                  <div>
                                    <div>
                                      <Typography variant="h6" component="div">
                                        {flashcard.front}
                                      </Typography>
                                    </div>
                                    <div>
                                      <Typography
                                        variant="body1"
                                        component="div"
                                      >
                                        {flashcard.back}
                                      </Typography>
                                    </div>
                                  </div>
                                </Box>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Save button */}
                  <Box sx={{ mt: 5, textAlign: 'center' }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<SaveIcon />}
                        onClick={handleOpen}
                        sx={{
                          py: 1.5,
                          px: 4,
                          background:
                            'linear-gradient(90deg, #6C63FF, #8A83FF)',
                          boxShadow: '0px 4px 15px rgba(108, 99, 255, 0.3)',
                          '&:hover': {
                            background:
                              'linear-gradient(90deg, #5A52FF, #6C63FF)',
                            boxShadow: '0px 4px 20px rgba(108, 99, 255, 0.5)',
                          },
                        }}
                      >
                        Save Flashcards
                      </Button>
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>
            )}
          </motion.div>
        </Container>
      </Box>

      {/* Save Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(20, 27, 45, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Save Flashcards
          </Typography>
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 3, color: 'text.secondary' }}>
            Give your flashcard collection a memorable name so you can easily
            find it later.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: 'rgba(10, 14, 23, 0.5)',
                borderRadius: '12px',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6C63FF',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6C63FF',
                },
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            sx={{
              color: 'text.secondary',
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={saveFlashcards}
            variant="contained"
            color="primary"
            sx={{
              background: 'linear-gradient(90deg, #6C63FF, #8A83FF)',
              '&:hover': {
                background: 'linear-gradient(90deg, #5A52FF, #6C63FF)',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
