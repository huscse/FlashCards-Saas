'use client'
import { SignIn, SignUp } from "@clerk/nextjs"
import { AppBar, Box, Button, Container, Toolbar, Typography, createTheme, ThemeProvider, CssBaseline } from "@mui/material"
import Link from "next/link"

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

export default function SignUpPage() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="100vw">
        <AppBar position="static" sx={{ backgroundColor: darkTheme.palette.background.paper }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, color: darkTheme.palette.text.primary }}>
              PromptWise
            </Typography>
            <Button color="inherit">
              <Link href="/sign-in" passHref style={{ color: darkTheme.palette.primary.main, textDecoration: 'none' }}>
                Login
              </Link>
            </Button>
            <Button color="inherit">
              <Link href="/sign-up" passHref style={{ color: darkTheme.palette.primary.main, textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="calc(100vh - 64px)"
          sx={{
            backgroundColor: darkTheme.palette.background.default,
            color: darkTheme.palette.text.primary,
            px: 2,
          }}
        >
          <Typography padding={2} variant="h4" gutterBottom>
        
          </Typography>
          <SignUp />
        </Box>
      </Container>
    </ThemeProvider>
  )
}
