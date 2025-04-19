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
} from '@mui/material';

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

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="100vw" sx={{ mt: 4, px: 3 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          My Flashcards
        </Typography>
        <Grid container spacing={4}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: 'background.paper',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
                  borderRadius: 4,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s',
                  },
                }}
              >
                <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                  <CardContent>
                    <Typography variant="h6" color="textPrimary">
                      {flashcard.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {flashcard.cards?.length || 0} cards
                    </Typography>
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
