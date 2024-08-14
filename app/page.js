import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Head from "next/head";

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
      <Box>
        <Typography variant="h2">Welcome to PromptWise</Typography>
        <Typography variant="h5">The easiest and fastest way to make flashcards with just a prompt</Typography>
      </Box>
    </Container>
  )
}