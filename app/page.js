'use client'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";

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

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="100vw" disableGutters>
        <Head>
          <title>PromptWise</title>
          <meta name="description" content="Create Flashcards from a prompt" />
        </Head>

        {/* Navigation Bar */}
        <AppBar position="static" sx={{ backgroundColor: "#2e3b55" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              PromptWise
            </Typography>
            <SignedOut>
              <Button
                color="inherit"
                href="/sign-in"
                sx={{ marginRight: 2, "&:hover": { backgroundColor: "#90caf9" } }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                href="/sign-up"
                sx={{ "&:hover": { backgroundColor: "#90caf9" } }}
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            height: "60vh",
            backgroundColor: "#1e1e1e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#fff",
            padding: "0 20px",
          }}
        >
          <Box>
            <Typography variant="h2" gutterBottom>
              Welcome to PromptWise
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              The easiest and fastest way to make flashcards with just a prompt!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                padding: "10px 20px",
                fontSize: "1.2rem",
                backgroundColor: "#90caf9",
                "&:hover": { backgroundColor: "#64b5f6" },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ my: 6, px: 3 }}>
          <Typography variant="h4" textAlign="center" mb={4}>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h6" mt={2}>
                  Easy Prompt Input
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Easily generates flashcards from simple text prompts,
                  streamlining the study process.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h6" mt={2}>
                  Smart Flashcards
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Ensures flashcards and study progress are synced across all
                  devices, allowing users to study anytime, anywhere.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h6" mt={2}>
                  Flashcards Generated in Minutes
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Customize the look and feel of your flashcards with minimal
                  effort, focusing on what matters most—learning.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Pricing Section */}
        <Box sx={{ my: 6, textAlign: "center", px: 3 }}>
          <Typography variant="h4" padding={3}>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: "background.paper",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                  borderRadius: 4,
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.3s",
                  },
                }}
              >
                <Typography variant="h5">Basic</Typography>
                <Typography variant="h6">Free</Typography>
                <Typography>
                  Generate Flashcards in minutes, saved flashcards, limited storage
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 2,
                    backgroundColor: "#90caf9",
                    "&:hover": { backgroundColor: "#64b5f6" },
                  }}
                >
                  Choose Plan
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: "background.paper",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                  borderRadius: 4,
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.3s",
                  },
                }}
              >
                <Typography variant="h5">Premium</Typography>
                <Typography variant="h6">$7 / month</Typography>
                <Typography>
                  Access to premium features and unlimited storage
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 2,
                    backgroundColor: "#90caf9",
                    "&:hover": { backgroundColor: "#64b5f6" },
                  }}
                >
                  Choose Plan
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
