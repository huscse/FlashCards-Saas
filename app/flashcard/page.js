'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  IconButton,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion, AnimatePresence } from 'framer-motion';

// Matching brutalist-swiss theme
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
  },
});

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [collectionName, setCollectionName] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get('id');

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      try {
        const docRef = doc(db, 'flashcard_collections', search);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCollectionName(data.name);
          setFlashcards(data.cards || []);
        }
      } catch (err) {
        console.error('Error fetching flashcards:', err);
      }
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = (index) => {
    if (deleteMode) return;
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDelete = async (index) => {
    const updated = [...flashcards];
    updated.splice(index, 1);

    try {
      const docRef = doc(db, 'flashcard_collections', search);
      await setDoc(docRef, {
        userId: user.id,
        name: collectionName,
        cards: updated,
        frontColor: flashcards[0]?.frontColor,
        backColor: flashcards[0]?.backColor,
      });
      setFlashcards(updated);
    } catch (err) {
      console.error('Failed to delete card:', err);
    }
  };

  const handleDeleteCollection = async () => {
    if (!confirm('Are you sure you want to delete this entire collection?'))
      return;

    try {
      await deleteDoc(doc(db, 'flashcard_collections', search));
      setFlashcards([]);
      router.push('/flashcards');
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
  };

  if (!isLoaded || !isSignedIn) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

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

      <Box className="noise" />

      {/* Navigation Bar */}
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
            onClick={() => router.push('/flashcards')}
            sx={{
              mr: 2,
              border: '2px solid #1E1E1E',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: '#1E1E1E',
                color: '#FFFEF2',
              },
            }}
          >
            <ArrowBackIcon />
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
          <Button
            variant={deleteMode ? 'contained' : 'outlined'}
            color={deleteMode ? 'primary' : 'secondary'}
            onClick={() => setDeleteMode(!deleteMode)}
            sx={{
              mr: 2,
              border: deleteMode ? 'none' : '2px solid #1E1E1E',
              '&:hover': {
                border: deleteMode ? 'none' : '2px solid #1E1E1E',
              },
            }}
          >
            {deleteMode ? 'DONE' : 'EDIT'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 14, mb: 8, px: { xs: 2, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
                COLLECTION
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3.5rem' },
                mb: 3,
                lineHeight: 1,
              }}
            >
              {collectionName || 'FLASHCARDS'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              >
                {flashcards.length} {flashcards.length === 1 ? 'card' : 'cards'}
              </Typography>
              <Box
                sx={{ width: '4px', height: '4px', backgroundColor: '#1E1E1E' }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              >
                Click cards to flip
              </Typography>
            </Box>
          </motion.div>
        </Box>

        {/* Delete Collection Button */}
        {deleteMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Box
              sx={{
                mb: 4,
                p: 3,
                border: '3px solid #FF2D55',
                backgroundColor: '#FFF',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                DELETE COLLECTION
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, color: 'text.secondary' }}
              >
                This action cannot be undone. All flashcards in this collection
                will be permanently deleted.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDeleteCollection}
                startIcon={<DeleteIcon />}
                sx={{
                  boxShadow: '4px 4px 0 #1E1E1E',
                  '&:hover': {
                    transform: 'translate(2px, 2px)',
                    boxShadow: '2px 2px 0 #1E1E1E',
                  },
                  transition: 'all 0.2s',
                }}
              >
                DELETE ENTIRE COLLECTION
              </Button>
            </Box>
          </motion.div>
        )}

        {/* Flashcards Grid */}
        {flashcards.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              border: '3px solid #1E1E1E',
              backgroundColor: '#FFF',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 700,
              }}
            >
              NO CARDS YET
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              This collection is empty.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      sx={{
                        position: 'relative',
                        backgroundColor: '#FFF',
                        boxShadow: deleteMode
                          ? '0 0 0 4px #FF2D55'
                          : '6px 6px 0 #1E1E1E',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: deleteMode
                            ? '0 0 0 4px #FF2D55'
                            : '3px 3px 0 #1E1E1E',
                          transform: deleteMode
                            ? 'none'
                            : 'translate(3px, 3px)',
                        },
                      }}
                    >
                      <CardActionArea
                        onClick={() => handleCardClick(index)}
                        disabled={deleteMode}
                        sx={{
                          cursor: deleteMode ? 'default' : 'pointer',
                        }}
                      >
                        <CardContent sx={{ p: 0, position: 'relative' }}>
                          {/* Delete Button */}
                          {deleteMode && (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(index);
                              }}
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                zIndex: 10,
                                backgroundColor: '#FF2D55',
                                color: '#FFFEF2',
                                border: '2px solid #1E1E1E',
                                borderRadius: 0,
                                '&:hover': {
                                  backgroundColor: '#E6194B',
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}

                          {/* Card Flip Container */}
                          <Box
                            sx={{
                              perspective: '1000px',
                              width: '100%',
                              height: '280px',
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
                              {/* Front of Card */}
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
                                  padding: 4,
                                  backgroundColor:
                                    flashcard.frontColor || '#1E1E1E',
                                  color: '#FFFEF2',
                                  borderBottom: '4px solid #1E1E1E',
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
                                      fontSize: '0.65rem',
                                      color: '#FFFEF2',
                                    }}
                                  >
                                    QUESTION
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    textAlign: 'center',
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '1.1rem',
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {flashcard.front}
                                </Typography>
                              </Box>

                              {/* Back of Card */}
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
                                  padding: 4,
                                  backgroundColor:
                                    flashcard.backColor || '#FF2D55',
                                  color: '#FFFEF2',
                                  transform: 'rotateY(180deg)',
                                  borderBottom: '4px solid #1E1E1E',
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
                                      fontSize: '0.65rem',
                                      color: '#FFFEF2',
                                    }}
                                  >
                                    ANSWER
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    textAlign: 'center',
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '1.1rem',
                                    lineHeight: 1.5,
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
            </AnimatePresence>
          </Grid>
        )}

        {/* Helper Text */}
        {!deleteMode && flashcards.length > 0 && (
          <Box
            sx={{
              mt: 6,
              p: 4,
              border: '3px solid #1E1E1E',
              backgroundColor: '#E8F4FF',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.05em',
              }}
            >
              💡 STUDY TIPS
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Click any card to reveal the answer. Try to recall the answer
              before flipping. For best results, review your flashcards daily
              using spaced repetition!!
            </Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}
