'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, deleteDoc, deleteField } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";
import { createTheme, ThemeProvider, CssBaseline, Card, CardActionArea, CardContent, Typography, Grid, Container, Box, IconButton, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { writeBatch } from "firebase/firestore";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [collectionName, setCollectionName] = useState('');

  const searchParams = useSearchParams();
  const search = searchParams.get('id');

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      setCollectionName(search); // Set the collection name
      const colRef = collection(doc(collection(db, 'users'), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (id) => {
    if (!user) return;
    const docRef = doc(collection(doc(collection(db, 'users'), user.id), collectionName), id);
    await deleteDoc(docRef);

    // Remove deleted flashcard from state
    setFlashcards((prev) => prev.filter(flashcard => flashcard.id !== id));
  };

  const handleDeleteCollection = async () => {
    if (!user || !collectionName) return;
    const colRef = collection(doc(collection(db, 'users'), user.id), collectionName);
    const docs = await getDocs(colRef);
    
    // Batch delete all documents in the collection
    const batch = writeBatch(db);
    docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Redirect or update state after deletion
    setFlashcards([]);
    // Optionally redirect the user or notify them
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="100vw" sx={{ mt: 4, px: 3 }}>
        <Typography padding={5} variant="h4" textAlign="center" gutterBottom>
          Flashcards Viewer
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
                  <CardContent>
                    <Box sx={{
                      perspective: '1000px',
                      '& > div': {
                        transition: 'transform 0.6s',
                        transformStyle: 'preserve-3d',
                        position: 'relative',
                        width: '100%',
                        height: '300px',
                        boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.3)',
                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      },
                      '& > div > div': {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: "hidden",
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
                    }}>
                      <div>
                        <div>
                          <Typography variant="h6" component="div">
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="h6" component="div">
                            {flashcard.back}
                          </Typography>
                        </div>
                      </div>
                    </Box>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents triggering the card flip
                        handleDelete(flashcard.id);
                      }}
                      sx={{ position: 'absolute', top: 8, right: 8, color: 'red' }}
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
