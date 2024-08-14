import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import { Londrina_Solid } from "next/font/google";

export default function Home() {
  return (
    <Container maxWidth = '100vw'>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name = "description" content= 'create Flashcards from a promot'></meta>
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>PromptWise</Typography>
          <SignedOut>
            <Button color="inherit">Login</Button>
            <Button color = 'inherit'>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx = {{
        textAlign: 'center',
        my: 4,
      }}>
        <Typography variant="h2">Welcome to PromptWise</Typography>
        <Typography variant="h5"> {''}The easiest and fastest way to make flashcards with just a prompt</Typography>
        <Button variant="contained" color = 'primary' sx = {{mt: 2}}> Get Started</Button>
      </Box>
      <Box sx = {{my: 6}}>
        <Typography variant='h6'>
          Features
        </Typography>
        <Grid contained spacing = {4}>
          <Grid item xs ={12} md = {4}>
            <Typography variant="h6">Easy prompt input</Typography>
            {''}
            <Typography>Easily generates flashcards from simple text prompts, streamlining the study process.</Typography>
          </Grid>

          <Grid item xs ={12} md = {4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            {''}
            <Typography>Ensures flashcards and study progress are synced across all devices, allowing users to study anytime, anywhere.</Typography>
          </Grid>

          <Grid item xs ={12} md = {4}>
            <Typography variant="h6">Flaashcards generated in minutes</Typography>
            {''}
            <Typography>Customize the look and feel of your flashcards with minimal effort, focusing on what matters most—learning.</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my: 6, textAlign: 'center'}}>
      <Typography variant='h4'>Pricing</Typography>
      <Grid contained spacing = {4}>
          <Grid item xs ={12} md = {4}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 3,
            }}> 
            
            <Typography variant="h6">Easy prompt input</Typography>
            {''}
            <Typography>Easily generates flashcards from simple text prompts, streamlining the study process.</Typography>
            </Box>
          </Grid>

          <Grid item xs ={12} md = {4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            {''}
            <Typography>Ensures flashcards and study progress are synced across all devices, allowing users to study anytime, anywhere.</Typography>
          </Grid>

          <Grid item xs ={12} md = {4}>
            <Typography variant="h6">Flaashcards generated in minutes</Typography>
            {''}
            <Typography>Customize the look and feel of your flashcards with minimal effort, focusing on what matters most—learning.</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}