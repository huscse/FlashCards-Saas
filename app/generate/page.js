'use client'
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "/firebase";
import React, { useState } from 'react';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/react"
import { CssBaseline, Container, Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, TextField, Typography, Grid } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
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

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [frontColor, setFrontColor] = useState('#ffffff'); // Default white text
  const [backColor, setBackColor] = useState('#2196f3'); // Default blue back color

  const handleSubmit = async () => {
    fetch('api/generate', {
      method: 'POST',
      body: JSON.stringify({ text, frontColor, backColor }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
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

  const saveFlashcards = async () => {
    if (!isSignedIn || !user) {
      alert('You must be signed in to save flashcards.');
      return;
    }
  
    if (!name) {
      alert('Please enter a name');
      return;
    }
  
    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);
  
    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert('Flashcard collection with the same name already exists.');
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }
  
    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, { ...flashcard, frontColor, backColor });
    });
  
    await batch.commit();
    handleClose();
    router.push('/flashcards');
  };
  

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box
          sx={{
            mt: 4,
            mb: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: '100%',
              maxWidth: '600px',
              background: "linear-gradient(135deg, #1e1e1e 30%, #333333 90%)",
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              border: '1px solid #424242',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              },
            }}
          >
            <Typography
              variant="h5"
              mb={2}
              textAlign="center"
              color="inherit"
              sx={{
                fontWeight: 'bold',
                fontSize: '24px',
                letterSpacing: '1.5px',
              }}
            >
              Enter a Prompt
            </Typography>
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
                  backgroundColor: '#2e2e2e',
                  color: '#ffffff',
                  borderRadius: '12px',
                  padding: '12px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#90caf9',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#64b5f6',
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: '#b0bec5',
                  fontWeight: '500',
                },
              }}
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              sx={{
                backgroundColor: "linear-gradient(135deg, #90caf9, #64b5f6)",
                borderRadius: '12px',
                fontWeight: 'bold',
                textTransform: 'none',
                color: '#ffffff',
                fontSize: '16px',
                padding: '12px 16px',
                "&:hover": {
                  backgroundColor: "linear-gradient(135deg, #64b5f6, #42a5f5)",
                  boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                },
              }}
            >
              Generate Flashcards
            </Button>
          </Paper>
        </Box>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" textAlign="center" mb={2}>
              Flashcards Preview
            </Typography>
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
                            backgroundColor: frontColor,
                            color: '#ffffff',
                          },
                          '& > div > div:nth-of-type(2)': {
                            backgroundColor: backColor,
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
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <TextField
                label="Front Color"
                type="color"
                value={frontColor}
                onChange={(e) => setFrontColor(e.target.value)}
                sx={{ width: '150px' }}
              />
              <TextField
                label="Back Color"
                type="color"
                value={backColor}
                onChange={(e) => setBackColor(e.target.value)}
                sx={{ width: '150px' }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              sx={{
                mt: 4,
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundColor: '#90caf9',
                '&:hover': {
                  backgroundColor: '#64b5f6',
                },
              }}
            >
              Save Flashcards
            </Button>
          </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard collection:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards} color="primary" variant="contained">
              Save
            </Button>
            <Analytics />
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
    
  );
}
