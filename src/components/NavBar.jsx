import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Button, Heading, Image } from '@chakra-ui/react';
import { useAuth } from './AuthContext';

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <Box bg="teal.500" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Image src="/logo_soy_cupido.jpg" alt="Soy Cupido Logo" boxSize="60px" mr={2} />
          <Heading as="h1" size="lg" color="white">
            Soy Cupido
          </Heading>
        </Flex>
        <Flex alignItems="center">
          <Button as={Link} to="/" variant="link" color="white" mr={4}>
            Inicio
          </Button>
          {user && (
            <>
              <Button as={Link} to={`/match-results/${user}`} variant="link" color="white" mr={4}>
                Coincidencias
              </Button>
              <Button as={Link} to="/edit-profile" variant="link" color="white" mr={4}>
                Editar Perfil
              </Button>
              <Button onClick={logout} variant="link" color="white">
                Cerrar Sesión
              </Button>
            </>
          )}
          {!user && (
            <>
              <Button as={Link} to="/login" variant="link" color="white" mr={4}>
                Iniciar Sesión
              </Button>
              <Button as={Link} to="/register" variant="link" color="white">
                Registrarse
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default NavBar;
