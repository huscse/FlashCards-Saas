'use client';
import { SignIn } from '@clerk/nextjs';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import Link from 'next/link';
import Head from 'next/head';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF', // Modern purple
    },
    background: {
      default: '#0A0E17', // Deep navy
      paper: '#141B2D', // Slightly lighter navy
    },
    text: {
      primary: '#ffffff',
      secondary: '#B8C7E0', // Soft blue-ish white
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

export default function SignInPage() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Head>
        <title>Sign In | PromptWise</title>
        <meta name="description" content="Sign in to your PromptWise account" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0A0E17 0%, #141B2D 100%)',
          backgroundImage:
            'radial-gradient(circle at 30% 50%, rgba(108, 99, 255, 0.08), transparent 40%), radial-gradient(circle at 70% 20%, rgba(99, 236, 255, 0.05), transparent 30%)',
        }}
      >
        {/* App Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: 'rgba(10, 14, 23, 0.6)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Toolbar
            sx={{ px: { xs: 2, md: 6 }, minHeight: { xs: '56px', sm: '64px' } }}
          >
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                background: 'linear-gradient(90deg, #6C63FF, #63ECFF)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
              }}
            >
              PromptWise
            </Typography>

            <Button
              color="primary"
              component={Link}
              href="/sign-in"
              sx={{
                mr: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 0.8 },
                px: { xs: 1, sm: 1.5 },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '0',
                  left: '25%',
                  width: '50%',
                  height: '2px',
                  background: 'linear-gradient(90deg, #6C63FF, #63ECFF)',
                },
              }}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              color="primary"
              component={Link}
              href="/sign-up"
              sx={{
                py: { xs: 0.5, sm: 0.8 },
                px: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              }}
            >
              Sign Up
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main content */}
        <Container
          sx={{
            minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 2, sm: 3 },
            py: { xs: 4, sm: 2 },
          }}
        >
          {/* Let Clerk handle the styling of its own component */}
          <Box
            sx={{
              width: '100%',
              maxWidth: '450px',
              mx: 'auto',
              my: { xs: 2, sm: 0 },
              p: { xs: 1, sm: 2 },
            }}
          >
            <SignIn
              appearance={{
                layout: {
                  showOptionalFields: false,
                  socialButtonsVariant: 'iconButton',
                  socialButtonsPlacement: 'top',
                },
                variables: {
                  colorPrimary: '#6C63FF',
                  colorText: '#FFFFFF',
                  colorTextSecondary: '#B8C7E0',
                  colorBackground: 'rgba(20, 27, 45, 0.6)',
                  colorInputBackground: 'rgba(10, 14, 23, 0.8)',
                  colorInputText: '#FFFFFF',
                  fontFamily: "'Inter', 'Roboto', sans-serif",
                },
                elements: {
                  card: {
                    backgroundColor: 'rgba(20, 27, 45, 0.7)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: { xs: '12px', sm: '16px' },
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                  },
                  headerTitle: {
                    fontSize: { xs: '20px', sm: '24px' },
                    fontWeight: '700',
                  },
                  headerSubtitle: {
                    color: '#B8C7E0',
                    fontSize: { xs: '14px', sm: '16px' },
                  },
                  formButtonPrimary: {
                    backgroundColor: '#6C63FF',
                    '&:hover': {
                      backgroundColor: '#5A52FF',
                    },
                  },
                  formFieldInput: {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    '&:focus': {
                      borderColor: '#6C63FF',
                      boxShadow: '0 0 0 1px #6C63FF',
                    },
                  },
                  footer: {
                    color: '#B8C7E0',
                    fontSize: { xs: '13px', sm: '14px' },
                  },
                  footerActionLink: {
                    color: '#63ECFF',
                  },
                  main: {
                    padding: { xs: '16px', sm: '24px' },
                  },
                },
              }}
              signUpUrl="/sign-up"
            />
          </Box>

          {/* Footer */}
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 2, sm: 3 },
              mt: 'auto',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} PromptWise. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
