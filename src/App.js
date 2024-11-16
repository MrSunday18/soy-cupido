import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme} from '@chakra-ui/react';
import MatchResults from './components/MatchResults';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './components/AuthContext';
import EditProfile from './components/EditProfile';

const theme = extendTheme({
  colors: {
    brand: {
      100: '#ff5864', // Un rojo similar al de Tinder
      200: '#ff6559', // Un poco más claro
    },
  },
  styles: {
    global: {
      body: {
        bg: 'red.900', // Fondo blanco para la página
        color: 'white', // Color de texto
      },
    },
  },
});


function App() {
  return (
    <AuthProvider>
    <ChakraProvider theme={theme}>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/match-results/:userID" element={<MatchResults />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/edit-profile" element={<EditProfile />} />
    </Routes>
    <Footer />
    </ChakraProvider>
    </AuthProvider>
  );
}

export default App;