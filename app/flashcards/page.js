'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { ArrowBack, Add } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';

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
  },
});

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'flashcard_collections'),
          where('userId', '==', user.id),
        );
        const querySnapshot = await getDocs(q);
        const collections = [];

        querySnapshot.forEach((doc) => {
          collections.push({ id: doc.id, ...doc.data() });
        });

        setFlashcards(collections);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      } finally {
        setLoading(false);
      }
    }

    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>My Flashcards | PromptWise</title>
        <meta
          name="description"
          content="View and manage your flashcard collections"
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

      <CssBaseline />
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
              href="/generate"
              variant="contained"
              color="primary"
              startIcon={<Add />}
              sx={{
                mr: 2,
                boxShadow: '4px 4px 0 #1E1E1E',
                '&:hover': {
                  transform: 'translate(2px, 2px)',
                  boxShadow: '2px 2px 0 #1E1E1E',
                },
                transition: 'all 0.2s',
              }}
            >
              CREATE NEW
            </Button>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{ mt: 14, mb: 8, px: { xs: 2, md: 4 }, position: 'relative' }}
      >
        {/* Geometric background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            right: '0%',
            width: '250px',
            height: '250px',
            border: '3px solid rgba(255, 45, 85, 0.1)',
            transform: 'rotate(15deg)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '2%',
            width: '200px',
            height: '200px',
            backgroundColor: 'rgba(232, 244, 255, 0.3)',
            transform: 'rotate(-12deg)',
            zIndex: 0,
          }}
        />

        {/* Header */}
        <Box sx={{ mb: 6, position: 'relative', zIndex: 1 }}>
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
                YOUR LIBRARY
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
              MY FLASHCARDS
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 400,
                mb: 2,
              }}
            >
              {loading
                ? 'Loading...'
                : `${flashcards.length} ${
                    flashcards.length === 1 ? 'collection' : 'collections'
                  }`}
            </Typography>
          </motion.div>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress
              size={60}
              sx={{
                color: '#FF2D55',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'square',
                },
              }}
            />
          </Box>
        )}

        {/* Empty State */}
        {!loading && flashcards.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                py: 10,
                px: 4,
                border: '3px solid #1E1E1E',
                backgroundColor: '#FFF',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                NO COLLECTIONS YET
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  maxWidth: '500px',
                  mx: 'auto',
                }}
              >
                Start your learning journey by creating your first flashcard
                collection.
              </Typography>
              <Button
                component={Link}
                href="/generate"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Add />}
                sx={{
                  boxShadow: '6px 6px 0 #1E1E1E',
                  '&:hover': {
                    transform: 'translate(3px, 3px)',
                    boxShadow: '3px 3px 0 #1E1E1E',
                  },
                  transition: 'all 0.2s',
                }}
              >
                CREATE FIRST COLLECTION
              </Button>
            </Box>
          </motion.div>
        )}

        {/* Flashcards Grid */}
        {!loading && flashcards.length > 0 && (
          <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
            <AnimatePresence>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
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
                        onClick={() => handleCardClick(flashcard.id)}
                      >
                        <CardContent sx={{ p: 4 }}>
                          {/* Card count badge */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
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
                                fontSize: '0.7rem',
                                color: '#FFFEF2',
                              }}
                            >
                              {flashcard.cards?.length || 0}
                            </Typography>
                          </Box>

                          {/* Collection name */}
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily: "'Unbounded', sans-serif",
                              fontWeight: 700,
                              fontSize: '1.3rem',
                              mb: 2,
                              pr: 6,
                              lineHeight: 1.3,
                            }}
                          >
                            {flashcard.name}
                          </Typography>

                          {/* Card count text */}
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              fontSize: '0.75rem',
                            }}
                          >
                            {flashcard.cards?.length || 0}{' '}
                            {flashcard.cards?.length === 1 ? 'CARD' : 'CARDS'}
                          </Typography>

                          {/* Decorative element */}
                          <Box
                            sx={{
                              mt: 3,
                              width: '60px',
                              height: '3px',
                              backgroundColor: '#FF2D55',
                            }}
                          />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}

        {/* Quick Stats */}
        {!loading && flashcards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box
              sx={{
                mt: 8,
                p: 4,
                border: '3px solid #1E1E1E',
                backgroundColor: '#E8F4FF',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.05em',
                }}
              >
                📊 YOUR STATS
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "'Unbounded', sans-serif",
                      fontSize: { xs: '1.8rem', md: '2.5rem' },
                      fontWeight: 900,
                      color: '#FF2D55',
                      mb: 1,
                    }}
                  >
                    {flashcards.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Collections
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "'Unbounded', sans-serif",
                      fontSize: { xs: '1.8rem', md: '2.5rem' },
                      fontWeight: 900,
                      color: '#FF2D55',
                      mb: 1,
                    }}
                  >
                    {flashcards.reduce(
                      (sum, fc) => sum + (fc.cards?.length || 0),
                      0,
                    )}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Total Cards
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        )}
      </Container>
    </ThemeProvider>
  );
}
