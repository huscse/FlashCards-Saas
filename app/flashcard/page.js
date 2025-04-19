'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [collectionName, setCollectionName] = useState('');
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
      await deleteDoc(docRef); // delete existing
      // then recreate with remaining cards
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
    try {
      await deleteDoc(doc(db, 'flashcard_collections', search));
      setFlashcards([]);
      router.push('/flashcards'); // go back to all flashcards page
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
  };

  if (!isLoaded || !isSignedIn) return null;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="100vw" sx={{ mt: 4, px: 3 }}>
        <Typography padding={5} variant="h4" textAlign="center" gutterBottom>
          {collectionName || 'Flashcards Viewer'}
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteCollection}
          sx={{ mb: 2 }}
        >
          Delete Collection
        </Button>
        <Grid container spacing={3}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <CardContent sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        perspective: '1000px',
                        '& > div': {
                          transition: 'transform 0.6s',
                          transformStyle: 'preserve-3d',
                          position: 'relative',
                          width: '100%',
                          height: '300px',
                          boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.3)',
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
                        },
                        '& > div > div:nth-of-type(1)': {
                          backgroundColor: flashcard.frontColor || '#ffffff',
                          color: '#ffffff',
                        },
                        '& > div > div:nth-of-type(2)': {
                          backgroundColor: flashcard.backColor || '#2196f3',
                          color: '#ffffff',
                          transform: 'rotateY(180deg)',
                        },
                      }}
                    >
                      <div>
                        <div>
                          <Typography variant="h6">
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="h6">{flashcard.back}</Typography>
                        </div>
                      </div>
                    </Box>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(index);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'red',
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
