'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { getDoc, doc, setDoc, collection } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { CardActionArea, CardContent, Container, Typography, Grid, Card } from "@mui/material"

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()
    
    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
    
            try {
                const docRef = doc(collection(db, 'users'), user.id)
                const docSnap = await getDoc(docRef)
                
                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data())  // Debugging line
                    const collections = docSnap.data().flashcards || []
                    console.log("Flashcards:", collections)  // Debugging line
                    setFlashcards(collections)
                } else {
                    console.log("No such document, initializing with empty flashcards array.")
                    await setDoc(docRef, { flashcards: [] })
                }
            } catch (error) {
                console.error("Error fetching flashcards:", error)
            }
        }
        getFlashcards()
    }, [user])
    
    
    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
