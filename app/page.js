'use client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  CssBaseline,
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
  Paper,
  useMediaQuery,
} from '@mui/material';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import getStripe from '@/utils/get-stripe';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import FloatingFlashcardModel from './floatingmodel/page';

// Bold, brutalist-inspired theme with Swiss design precision
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF2D55',
      contrastText: '#FFFEF2',
    },
    secondary: {
      main: '#1E1E1E',
    },
    background: {
      default: '#FFFEF2',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1E1E',
      secondary: '#6B6B6B',
    },
  },
  typography: {
    fontFamily: "'Archivo', 'Helvetica Neue', sans-serif",
    h1: {
      fontFamily: "'Unbounded', 'Arial Black', sans-serif",
      fontWeight: 800,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontFamily: "'Unbounded', 'Arial Black', sans-serif",
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontFamily: "'Unbounded', 'Arial Black', sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: "'Archivo', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontFamily: "'Archivo', sans-serif",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontSize: '1.05rem',
      lineHeight: 1.7,
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.1em',
          padding: '16px 32px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 0,
        },
      },
    },
  },
});

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      router.push('/sign-in');
    }
  };

  const handleBasicPlan = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      router.push('/sign-in');
    }
  };

  const handlePremiumPlan = async () => {
    try {
      const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          origin: 'https://promptwise-first.vercel.app',
        },
      });
      const checkoutSessionJson = await checkoutSession.json();
      if (checkoutSession.statusCode === 500) {
        console.error(checkoutSession.message);
        return;
      }
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });
      if (error) {
        console.warn(error.message);
      } else {
        router.push('/generate');
      }
    } catch (err) {
      console.error('Failed to redirect to Stripe:', err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>PromptWise — Intelligence Amplified</title>
        <meta
          name="description"
          content="Transform knowledge into memory with AI-powered flashcards"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800;900&family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        ::selection {
          background: #ff2d55;
          color: #fffef2;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .noise {
          position: fixed;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          width: 200%;
          height: 200vh;
          background: transparent
            url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')
            repeat;
          pointer-events: none;
          opacity: 0.4;
          z-index: 1000;
        }
      `}</style>

      <Box className="noise" />

      {/* Navigation */}
      <AppBar
        position="fixed"
        elevation={0}
        component={motion.div}
        sx={{
          backgroundColor: 'transparent',
          borderBottom: 'none',
        }}
      >
        <motion.div
          style={{
            opacity: headerOpacity,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FFFEF2',
            borderBottom: '3px solid #1E1E1E',
            zIndex: -1,
          }}
        />
        <Toolbar sx={{ py: 2, px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 900,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              color: '#1E1E1E',
            }}
          >
            PROMPTWISE
          </Typography>
          <SignedOut>
            <Button
              variant="text"
              href="/sign-in"
              sx={{
                mr: 2,
                color: '#1E1E1E',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
            >
              LOGIN
            </Button>
            <Button
              variant="contained"
              color="primary"
              href="/sign-up"
              sx={{
                boxShadow: '4px 4px 0 #1E1E1E',
                '&:hover': {
                  transform: 'translate(2px, 2px)',
                  boxShadow: '2px 2px 0 #1E1E1E',
                },
                transition: 'all 0.2s',
              }}
            >
              SIGN UP
            </Button>
          </SignedOut>
          <SignedIn>
            <Button
              variant="outlined"
              href="/flashcards"
              sx={{
                mr: 2,
                border: '2px solid #1E1E1E',
                color: '#1E1E1E',
                '&:hover': {
                  backgroundColor: '#1E1E1E',
                  color: '#FFFEF2',
                  border: '2px solid #1E1E1E',
                },
              }}
            >
              MY FLASHCARDS
            </Button>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section - Bold Brutalist Layout */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 12, md: 8 },
          pb: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Geometric Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '-5%',
            width: '40%',
            height: '40%',
            background: '#FFE5EC',
            transform: 'rotate(12deg)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '-10%',
            width: '30%',
            height: '30%',
            background: '#E8F4FF',
            transform: 'rotate(-8deg)',
            zIndex: 0,
          }}
        />
        <Box
          component={motion.div}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '80vw',
            height: '80vw',
            maxWidth: '800px',
            maxHeight: '800px',
            border: '2px solid rgba(255, 45, 85, 0.1)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box
                  sx={{
                    display: 'inline-block',
                    border: '2px solid #1E1E1E',
                    px: 3,
                    py: 1,
                    mb: 3,
                    backgroundColor: '#FFF',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      fontSize: '0.75rem',
                    }}
                  >
                    INTELLIGENCE × MEMORY
                  </Typography>
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: {
                      xs: '2.5rem',
                      sm: '3.5rem',
                      md: '5rem',
                      lg: '6rem',
                    },
                    lineHeight: 0.95,
                    mb: 4,
                    position: 'relative',
                  }}
                >
                  YOUR BRAIN
                  <br />
                  <Box
                    component="span"
                    sx={{
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '-4%',
                        right: '-4%',
                        height: '30%',
                        background: '#FF2D55',
                        zIndex: -1,
                      }}
                    />
                    AMPLIFIED
                  </Box>
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    maxWidth: '600px',
                    mb: 5,
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    lineHeight: 1.6,
                    color: 'text.secondary',
                  }}
                >
                  Transform any concept into perfectly structured flashcards.
                  AI-powered learning that actually sticks.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleGetStarted}
                    sx={{
                      boxShadow: '6px 6px 0 #1E1E1E',
                      fontSize: '1rem',
                      '&:hover': {
                        transform: 'translate(3px, 3px)',
                        boxShadow: '3px 3px 0 #1E1E1E',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    START LEARNING
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      border: '3px solid #1E1E1E',
                      color: '#1E1E1E',
                      backgroundColor: '#FFF',
                      '&:hover': {
                        backgroundColor: '#1E1E1E',
                        color: '#FFFEF2',
                        border: '3px solid #1E1E1E',
                      },
                    }}
                  >
                    SEE HOW IT WORKS
                  </Button>
                </Box>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 6,
                    mt: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  {[
                    { number: '10K+', label: 'Active Users' },
                    { number: '500K+', label: 'Cards Created' },
                    { number: '98%', label: 'Success Rate' },
                  ].map((stat, i) => (
                    <Box key={i}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: "'Unbounded', sans-serif",
                          fontSize: { xs: '1.8rem', md: '2.5rem' },
                          fontWeight: 900,
                          color: '#FF2D55',
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: '400px', md: '600px' },
                    border: '4px solid #1E1E1E',
                    backgroundColor: '#FFF',
                    boxShadow: '12px 12px 0 #1E1E1E',
                  }}
                >
                  <FloatingFlashcardModel />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#FF2D55',
                      border: '3px solid #1E1E1E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Unbounded', sans-serif",
                      fontWeight: 900,
                      fontSize: '1.5rem',
                      color: '#FFFEF2',
                      animation: 'float 3s ease-in-out infinite',
                    }}
                  >
                    AI
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features - Swiss Grid Layout */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          backgroundColor: '#1E1E1E',
          color: '#FFFEF2',
          position: 'relative',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={0}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ borderRight: { md: '1px solid rgba(255,255,255,0.2)' } }}
            >
              <Box sx={{ p: { xs: 4, md: 6 } }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2rem', md: '3rem' },
                    mb: 3,
                    lineHeight: 1,
                  }}
                >
                  WHY
                  <br />
                  PROMPTWISE?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '1.1rem',
                  }}
                >
                  We don&apos;t just create flashcards. We engineer knowledge
                  retention through intelligent design and cognitive science.
                </Typography>
              </Box>
            </Grid>

            {[
              {
                number: '01',
                title: 'Neural Processing',
                description:
                  'Advanced AI analyzes context, extracts key concepts, and structures information for optimal retention.',
              },
              {
                number: '02',
                title: 'Instant Generation',
                description:
                  'From complex topics to simple facts, create perfect flashcards in seconds, not hours.',
              },
              {
                number: '03',
                title: 'Universal Sync',
                description:
                  'Your knowledge, everywhere. Seamless synchronization across every device you own.',
              },
            ].map((feature, i) => (
              <Grid
                item
                xs={12}
                md={4}
                key={i}
                sx={{
                  borderRight: {
                    md: i < 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  },
                  borderTop: {
                    xs: '1px solid rgba(255,255,255,0.2)',
                    md: 'none',
                  },
                }}
              >
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  sx={{ p: { xs: 4, md: 6 }, height: '100%' }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "'Unbounded', sans-serif",
                      fontSize: '1rem',
                      mb: 3,
                      color: '#FF2D55',
                      letterSpacing: '0.2em',
                    }}
                  >
                    {feature.number}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: '1.5rem',
                      mb: 2,
                      fontWeight: 700,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing - Bold Cards */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 3,
              }}
            >
              CHOOSE YOUR PATH
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 400,
              }}
            >
              Start free, upgrade when ready
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {/* Basic Plan */}
            <Grid item xs={12} md={5}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                sx={{
                  border: '3px solid #1E1E1E',
                  backgroundColor: '#FFF',
                  p: 5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Unbounded', sans-serif",
                    fontSize: '0.9rem',
                    letterSpacing: '0.15em',
                    mb: 2,
                  }}
                >
                  BASIC
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: '4rem',
                    mb: 1,
                  }}
                >
                  FREE
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 4,
                    color: 'text.secondary',
                  }}
                >
                  Forever
                </Typography>

                <Box sx={{ mb: 4, flex: 1 }}>
                  {[
                    'Up to 50 flashcards',
                    'Basic AI generation',
                    'Core study features',
                    'Mobile & desktop access',
                  ].map((feature, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#E8F4FF',
                          border: '2px solid #1E1E1E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#1E1E1E',
                          }}
                        />
                      </Box>
                      <Typography variant="body1">{feature}</Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleBasicPlan}
                  sx={{
                    border: '3px solid #1E1E1E',
                    color: '#1E1E1E',
                    '&:hover': {
                      backgroundColor: '#1E1E1E',
                      color: '#FFFEF2',
                      border: '3px solid #1E1E1E',
                    },
                  }}
                >
                  GET STARTED
                </Button>
              </Box>
            </Grid>

            {/* Premium Plan */}
            <Grid item xs={12} md={5}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                sx={{
                  border: '4px solid #FF2D55',
                  backgroundColor: '#1E1E1E',
                  color: '#FFFEF2',
                  p: 5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '8px 8px 0 #FF2D55',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: 20,
                    backgroundColor: '#FF2D55',
                    color: '#FFFEF2',
                    px: 3,
                    py: 1,
                    border: '3px solid #1E1E1E',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                  }}
                >
                  POPULAR
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Unbounded', sans-serif",
                    fontSize: '0.9rem',
                    letterSpacing: '0.15em',
                    mb: 2,
                    color: '#FF2D55',
                  }}
                >
                  PREMIUM
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: '4rem',
                    }}
                  >
                    $5
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      ml: 1,
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    /month
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 4,
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  Billed monthly
                </Typography>

                <Box sx={{ mb: 4, flex: 1 }}>
                  {[
                    'Unlimited flashcards',
                    'Advanced AI analysis',
                    'Priority generation',
                    'Complete analytics suite',
                    'Custom study modes',
                    'Priority support',
                  ].map((feature, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#FF2D55',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#FFFEF2',
                          }}
                        />
                      </Box>
                      <Typography variant="body1">{feature}</Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  href="https://buy.stripe.com/6oE4hD5esdyugcE5kk"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    backgroundColor: '#FF2D55',
                    color: '#FFFEF2',
                    boxShadow: '4px 4px 0 rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: '#E6194B',
                      transform: 'translate(2px, 2px)',
                      boxShadow: '2px 2px 0 rgba(255,255,255,0.2)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  UPGRADE NOW
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 12, md: 20 },
          backgroundColor: '#FF2D55',
          color: '#FFFEF2',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Geometric patterns */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
          }}
        >
          {[...Array(20)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                border: '2px solid #FFFEF2',
                left: `${(i % 5) * 20}%`,
                top: `${Math.floor(i / 5) * 25}%`,
                transform: `rotate(${i * 15}deg)`,
              }}
            />
          ))}
        </Box>

        <Container
          maxWidth="lg"
          sx={{ position: 'relative', textAlign: 'center' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '5rem' },
                mb: 4,
                lineHeight: 1,
              }}
            >
              READY TO
              <br />
              LEARN FASTER?
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 6,
                maxWidth: '700px',
                mx: 'auto',
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 400,
                opacity: 0.9,
              }}
            >
              Join thousands of students and professionals who&apos;ve
              transformed
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                backgroundColor: '#1E1E1E',
                color: '#FFFEF2',
                boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: '#000',
                  transform: 'translate(3px, 3px)',
                  boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                },
                transition: 'all 0.2s',
              }}
            >
              START FOR FREE
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: '#1E1E1E',
          color: '#FFFEF2',
          py: 6,
          borderTop: '4px solid #FF2D55',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontWeight: 900,
                  mb: 2,
                }}
              >
                PROMPTWISE
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.05em',
                }}
              >
                © {new Date().getFullYear()} PromptWise. Intelligence Amplified.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                }}
              >
                {['PRIVACY', 'TERMS', 'CONTACT'].map((link) => (
                  <Button
                    key={link}
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      fontSize: '0.75rem',
                      '&:hover': {
                        color: '#FF2D55',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    {link}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Analytics />
    </ThemeProvider>
  );
}
