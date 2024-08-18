'use client'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/generate');
  };

  const handleSubmit = () => {
    // Define your handleSubmit logic here
    router.push('/pricing');
  };

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
              <Button
                color="inherit"
                href="/flashcards"
                sx={{ marginRight: 2, "&:hover": { backgroundColor: "#90caf9" } }}
              >
                My Flashcards
              </Button>
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
            <SignedIn>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  padding: "10px 20px",
                  fontSize: "1.2rem",
                  backgroundColor: "#90caf9",
                  "&:hover": { backgroundColor: "#64b5f6" },
                }}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </SignedIn>
            <SignedOut>
              <Button
                variant="contained"
                
                color="primary"
                href="/sign-in"
                sx={{
                  padding: "10px 20px",
                  fontSize: "1.1rem",
                  backgroundColor: "#90caf9",
                  "&:hover": { backgroundColor: "#64b5f6" },
                }}
              >
                Sign In to Get Started
              </Button>
            </SignedOut>
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
                <Typography variant="h6" mt={2} padding={1}>
                  Easy Prompt Input
                </Typography>
                <Typography variant="body1" color="textSecondary">
                Quickly generate flashcards from simple text prompts. Streamline your study process with ease.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h6" mt={2} padding={1}>
                  Smart Flashcards
                </Typography>
                <Typography variant="body1" color="textSecondary">
                Sync your flashcards and study progress across devices, allowing you to study anytime, anywhere.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h6" mt={2} padding={1}>
                  Flashcards Generated in Seconds
                </Typography>
                <Typography variant="body1" color="textSecondary">
                Customize and create flashcards in no time. Focus on learning with minimal effort.
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
                  onClick={handleSubmit}
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
