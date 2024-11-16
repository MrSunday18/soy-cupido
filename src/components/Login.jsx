import React, { useState } from 'react';
import { Box, Input, Button, Text, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      const { userID } = response.data;
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      login(userID);
      navigate(`/match-results/${userID}`);
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error.response?.data?.error || 'Error desconocido al iniciar sesión',
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} bg="red.700" maxW="60%" mx="auto" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Text mb={4} fontSize="xl" fontWeight="bold">Iniciar Sesión</Text>
      <form onSubmit={handleSubmit}>
        <Input
          name="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={3}
          bg="white"
          color="black"
        />
        <Input
          name="password"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={3}
          bg="white"
          color="black"
        />
        <Button type="submit" colorScheme="teal" width="full">Iniciar sesión</Button>
      </form>
    </Box>
  );
}

export default Login;
