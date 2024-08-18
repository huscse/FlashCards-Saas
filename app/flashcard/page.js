'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { createTheme, ThemeProvider, CssBaseline, Card, CardActionArea, CardContent, Typography, Grid, Container, Box } from "@mui/material"

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
})

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})

  const searchParams = useSearchParams()
  const search = searchParams.get('id')

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return
      const colRef = collection(doc(collection(db, 'users'), user.id), search)
      const docs = await getDocs(colRef)
      const flashcards = []

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() })
      })
      setFlashcards(flashcards)
    }
    getFlashcard()
  }, [user, search])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="100vw" sx={{ mt: 4, px: 3 }}>
        <Typography padding={5} variant="h4" textAlign="center" gutterBottom>
          Flashcard Viewer
        </Typography>
        <Grid container spacing={4}>
          {flashcards.map((flashcard) => (
            <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
              <Card
                sx={{
                  backgroundColor: "background.paper",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                  borderRadius: 6,
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.3s",
                  },
                }}
              >
                <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                  <CardContent>
                    <Box sx={{
                      perspective: '1000px',
                      '& > div': {
                        transition: 'transform 0.6s',
                        transformStyle: 'preserve-3d',
                        position: 'relative',
                        width: '100%',
                        height: '200px',
                        transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
                      },
                      '& > div > div:nth-of-type(1)': {
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                      },
                      '& > div > div:nth-of-type(2)': {
                        transform: 'rotateY(180deg)',
                        backgroundColor: '#2e3b55',  // Green color for the back
                        color: '#ffffff',
                      },
                    }}>
                      <div>
                        <div>
                          <Typography variant="h5" component="div">
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="h5" component="div">
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
      </Container>
    </ThemeProvider>
  )
}
