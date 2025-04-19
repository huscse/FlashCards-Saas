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
  Divider,
  useMediaQuery,
} from '@mui/material';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import getStripe from '@/utils/get-stripe';
import { motion } from 'framer-motion';
import { Lightbulb, Sync, Timer, ArrowForward } from '@mui/icons-material';
import { Analytics } from '@vercel/analytics/react';
import FloatingFlashcardModel from './floatingmodel/page';

// Custom theme with a more modern color palette
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF', // Modern purple
    },
    secondary: {
      main: '#63ECFF', // Cyan accent
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
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
        },
        containedPrimary: {
          boxShadow: '0 4px 14px 0 rgba(108, 99, 255, 0.39)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'));

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
        router.push('/generate'); // Redirect to generate page after successful payment
      }
    } catch (err) {
      console.error('Failed to redirect to Stripe:', err);
    }
  };

  // Animated gradient background styles
  const gradientBgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'radial-gradient(circle at 30% 50%, rgba(108, 99, 255, 0.1), transparent 40%), radial-gradient(circle at 70% 20%, rgba(99, 236, 255, 0.08), transparent 30%)',
    zIndex: 0,
  };

  // Card hovering animation
  const cardHoverAnimation = {
    rest: {
      y: 0,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    hover: {
      y: -10,
      boxShadow: '0 20px 30px rgba(0, 0, 0, 0.3)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters sx={{ overflow: 'hidden' }}>
        <Head>
          <title>PromptWise | Smart Flashcard Generation</title>
          <meta
            name="description"
            content="Create AI-powered flashcards from any prompt to streamline your study experience"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>

        {/* Navigation Bar - Glassmorphism effect */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: 'rgba(10, 14, 23, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Toolbar sx={{ px: { xs: 2, md: 6 } }}>
            <Typography
              variant="h5"
              sx={{
                flexGrow: 1,
                fontWeight: '700',
                background: 'linear-gradient(90deg, #6C63FF, #63ECFF)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              PromptWise
            </Typography>
            <SignedOut>
              <Button
                color="inherit"
                href="/sign-in"
                sx={{
                  mr: 2,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(108, 99, 255, 0.1)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                href="/sign-up"
                sx={{
                  fontWeight: 500,
                  boxShadow: '0 4px 14px 0 rgba(108, 99, 255, 0.39)',
                }}
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <Button
                variant="outlined"
                color="primary"
                href="/flashcards"
                sx={{
                  mr: 2,
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(108, 99, 255, 0.1)',
                  },
                }}
              >
                My Flashcards
              </Button>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        {/* Hero Section - with 3D elements and motion */}
        <Box
          sx={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#fff',
            pt: 10,
            overflow: 'hidden',
          }}
        >
          {/* Animated background gradient */}
          <Box sx={gradientBgStyle} />

          {/* Floating elements - decorative */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 0,
            }}
          >
            <motion.div
              animate={{
                y: [20, 0, 20],
                x: [10, -10, 10],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '200px',
                height: '200px',
                borderRadius: '40%',
                background:
                  'radial-gradient(circle, rgba(108, 99, 255, 0.1), transparent 70%)',
              }}
            />
            <motion.div
              animate={{
                y: [-30, 0, -30],
                x: [-5, 15, -5],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                position: 'absolute',
                top: '60%',
                right: '15%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(99, 236, 255, 0.05), transparent 70%)',
              }}
            />
          </Box>

          {/* Content */}
          <Container
            maxWidth="lg"
            sx={{ position: 'relative', zIndex: 2, py: 12 }}
          >
            <Grid container spacing={6} alignItems="center">
              <Grid
                item
                xs={12}
                md={6}
                sx={{ textAlign: { xs: 'center', md: 'left' } }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      fontSize: { xs: '2.2rem', md: '3rem' },
                      background: 'linear-gradient(90deg, #fff, #B8C7E0)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Transform Learning with AI-Powered Flashcards
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 4,
                      color: 'text.secondary',
                      fontWeight: 400,
                      maxWidth: { md: '90%' },
                    }}
                  >
                    Create comprehensive, intelligent flashcards from any
                    prompt. Simplify your study routine and accelerate your
                    learning journey today.
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={handleGetStarted}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1rem',
                      boxShadow: '0px 8px 20px rgba(108, 99, 255, 0.3)',
                      background: 'linear-gradient(90deg, #6C63FF, #7E77FF)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #5A52FF, #6C63FF)',
                        boxShadow: '0px 8px 25px rgba(108, 99, 255, 0.5)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Started Free
                  </Button>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      height: { xs: '300px', md: '460px' },
                      width: '100%',
                      perspective: '1000px',
                    }}
                  >
                    <FloatingFlashcardModel />
                    {/* Floating "glow" effect behind the mockup */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        height: '70%',
                        borderRadius: '50%',
                        background:
                          'radial-gradient(circle, rgba(108, 99, 255, 0.3) 0%, rgba(99, 236, 255, 0.1) 50%, transparent 70%)',
                        filter: 'blur(40px)',
                        zIndex: -1,
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section - with card effect */}
        <Box sx={{ position: 'relative', py: 12, px: { xs: 2, md: 6 } }}>
          {/* Section background with subtle pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'radial-gradient(circle at 70% 30%, rgba(108, 99, 255, 0.08), transparent 40%)',
              zIndex: 0,
            }}
          />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h3"
                textAlign="center"
                mb={2}
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #fff, #B8C7E0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Supercharge Your Learning
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                color="text.secondary"
                sx={{ mb: 8, maxWidth: '700px', mx: 'auto' }}
              >
                PromptWise uses advanced AI to turn your study material into
                effective learning tools
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              {[
                {
                  icon: <Lightbulb sx={{ fontSize: 40, color: '#63ECFF' }} />,
                  title: 'Intelligent Prompt Analysis',
                  description:
                    'Our AI deeply analyzes your content to extract key concepts and create comprehensive flashcards that highlight the most important information.',
                },
                {
                  icon: <Sync sx={{ fontSize: 40, color: '#6C63FF' }} />,
                  title: 'Cross-Device Synchronization',
                  description:
                    'Study seamlessly across all your devices with real-time synchronization of your flashcards and learning progress.',
                },
                {
                  icon: <Timer sx={{ fontSize: 40, color: '#63ECFF' }} />,
                  title: 'Rapid Flashcard Generation',
                  description:
                    'Create comprehensive study materials in seconds. Focus on learning instead of spending hours making flashcards manually.',
                },
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover="hover"
                    animate="rest"
                    variants={cardHoverAnimation}
                  >
                    <Paper
                      sx={{
                        p: 4,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: 'rgba(20, 27, 45, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Box
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          textAlign: 'center',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textAlign: 'center' }}
                      >
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Pricing Section - with glass effect */}
        <Box
          sx={{
            position: 'relative',
            py: 12,
            px: { xs: 2, md: 6 },
            background:
              'linear-gradient(180deg, rgba(10, 14, 23, 0) 0%, rgba(20, 27, 45, 0.8) 100%)',
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h3"
                textAlign="center"
                mb={2}
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #fff, #B8C7E0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Simple Pricing
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                color="text.secondary"
                sx={{ mb: 8, maxWidth: '700px', mx: 'auto' }}
              >
                Choose the plan that works best for your study needs
              </Typography>
            </motion.div>

            <Grid container spacing={4} justifyContent="center">
              {/* Basic Plan */}
              <Grid item xs={12} sm={6} md={5}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover="hover"
                  animate="rest"
                  variants={cardHoverAnimation}
                >
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(20, 27, 45, 0.4)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Background glow */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '30%',
                        background:
                          'linear-gradient(180deg, rgba(99, 236, 255, 0.1) 0%, transparent 100%)',
                        opacity: 0.5,
                        zIndex: 0,
                      }}
                    />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h5" fontWeight={600} mb={1}>
                        Basic
                      </Typography>
                      <Typography variant="h3" fontWeight={700} mb={2}>
                        Free
                      </Typography>
                      <Divider
                        sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }}
                      />
                      <Box sx={{ mb: 4 }}>
                        <Typography
                          sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                        >
                          <Box
                            component="span"
                            sx={{ color: '#63ECFF', mr: 2 }}
                          >
                            ✓
                          </Box>
                          Create and save basic flashcards
                        </Typography>
                        <Typography
                          sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                        >
                          <Box
                            component="span"
                            sx={{ color: '#63ECFF', mr: 2 }}
                          >
                            ✓
                          </Box>
                          Limited storage (up to 50 flashcards)
                        </Typography>
                        <Typography
                          sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                        >
                          <Box
                            component="span"
                            sx={{ color: '#63ECFF', mr: 2 }}
                          >
                            ✓
                          </Box>
                          Basic study analytics
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 'auto', position: 'relative', zIndex: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={handleBasicPlan}
                        sx={{
                          py: 1.5,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            backgroundColor: 'rgba(99, 236, 255, 0.1)',
                          },
                        }}
                      >
                        Get Started
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Premium Plan */}
              <Grid item xs={12} sm={6} md={5}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover="hover"
                  animate="rest"
                  variants={cardHoverAnimation}
                >
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(20, 27, 45, 0.4)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(108, 99, 255, 0.3)',
                      boxShadow: '0 0 20px rgba(108, 99, 255, 0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Premium tag */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: -35,
                        transform: 'rotate(45deg)',
                        backgroundColor: '#6C63FF',
                        color: '#fff',
                        py: 0.5,
                        px: 4,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        zIndex: 2,
                        boxShadow: '0 2px 10px rgba(108, 99, 255, 0.3)',
                      }}
                    >
                      RECOMMENDED
                    </Box>

                    {/* Background glow */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '30%',
                        background:
                          'linear-gradient(180deg, rgba(108, 99, 255, 0.15) 0%, transparent 100%)',
                        opacity: 0.5,
                        zIndex: 0,
                      }}
                    />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h5" fontWeight={600} mb={1}>
                        Premium
                      </Typography>
                      <Typography variant="h3" fontWeight={700} mb={0}>
                        $5
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        mb={2}
                      >
                        per month
                      </Typography>
                      <Divider
                        sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }}
                      />
                      <Box sx={{ mb: 4 }}>
                        <Typography
                          sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                        >
                          <Box
                            component="span"
                            sx={{ color: '#6C63FF', mr: 2 }}
                          >
                            ✓
                          </Box>
                          Unlimited flashcard creation
                        </Typography>
                        <Typography
                          sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                        >
                          <Box
                            component="span"
                            sx={{ color: '#6C63FF', mr: 2 }}
                          >
                            ✓
                          </Box>
                          Advanced AI-powered analysis
                        </Typography>
                        <Typography
                          sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                        >
                          <Box
                            component="span"
                            sx={{ color: '#6C63FF', mr: 2 }}
                          >
                            ✓
                          </Box>
                          Comprehensive study analytics
                        </Typography>
                        <Typography
                          sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                        >
                          <Box
                            component="span"
                            sx={{ color: '#6C63FF', mr: 2 }}
                          >
                            ✓
                          </Box>
                          Priority support
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 'auto', position: 'relative', zIndex: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        href="https://buy.stripe.com/6oE4hD5esdyugcE5kk"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          py: 1.5,
                          background:
                            'linear-gradient(90deg, #6C63FF, #8A83FF)',
                          boxShadow: '0px 4px 15px rgba(108, 99, 255, 0.3)',
                          '&:hover': {
                            background:
                              'linear-gradient(90deg, #5A52FF, #6C63FF)',
                            boxShadow: '0px 4px 20px rgba(108, 99, 255, 0.5)',
                          },
                        }}
                      >
                        Upgrade Now
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Interactive Demo Hint - Optional but adds value */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          sx={{
            py: 10,
            textAlign: 'center',
            background:
              'linear-gradient(180deg, rgba(20, 27, 45, 0.8) 0%, rgba(10, 14, 23, 0) 100%)',
          }}
        >
          <Container maxWidth="md">
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                background: 'rgba(10, 14, 23, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background effect */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background:
                    'radial-gradient(circle at 30% 40%, rgba(108, 99, 255, 0.1), transparent 50%)',
                  zIndex: 0,
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Ready to transform your study approach?
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}
                >
                  Join thousands of students who use PromptWise to create
                  effective flashcards in seconds and accelerate their learning
                  journey.
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleGetStarted}
                    sx={{
                      py: 1.5,
                      px: 4,
                      background: 'linear-gradient(90deg, #6C63FF, #8A83FF)',
                      boxShadow: '0px 4px 15px rgba(108, 99, 255, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #5A52FF, #6C63FF)',
                        boxShadow: '0px 4px 20px rgba(108, 99, 255, 0.5)',
                      },
                    }}
                  >
                    Get Started Free
                  </Button>
                </motion.div>
              </Box>
            </Paper>
          </Container>
        </Box>

        {/* Footer - Modern and minimal */}
        <Box
          sx={{
            backgroundColor: 'rgba(10, 14, 23, 0.9)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            py: 4,
            position: 'relative',
          }}
        >
          <Container maxWidth="lg">
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid
                item
                xs={12}
                md={6}
                sx={{ textAlign: { xs: 'center', md: 'left' } }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #6C63FF, #63ECFF)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  PromptWise
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  © {new Date().getFullYear()} PromptWise. All rights reserved.
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ textAlign: { xs: 'center', md: 'right' } }}
              >
                <Button
                  color="inherit"
                  sx={{ mx: 1, opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  Privacy
                </Button>
                <Button
                  color="inherit"
                  sx={{ mx: 1, opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  Terms
                </Button>
                <Button
                  color="inherit"
                  sx={{ mx: 1, opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  Contact
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>
      <Analytics />
    </ThemeProvider>
  );
}
