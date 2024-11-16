import React from 'react';
import { Box, Heading, Button, Text, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <Box textAlign="center" py={10} px={6}>
          <Heading as="h1" size="2xl" mb={6}>
            Bienvenido a Soy Cupido
          </Heading>
          <Flex justifyContent="center" mb={8}>
                <Button colorScheme="teal" size="lg" as={Link} to="/login" mr={4}>
                    Iniciar Sesión
                </Button>
                <Button colorScheme="blue" size="lg" as={Link} to="/register">
                    Registrarse
                </Button>
            </Flex>
          <Box mt={8}>
                <Text fontSize="lg">
                    Soy Cupido es una plataforma de citas en línea donde puedes encontrar tu pareja ideal. 
                    Regístrate y empieza a conocer personas que comparten tus intereses y valores. 
                    Una vez registrado, nuestro sistema te ofrecerá recomendaciones personalizadas 
                    para que encuentres el amor verdadero. ¡Únete a nosotros y disfruta del camino hacia el amor!
                </Text>
            </Box>
        </Box>
      );
    }
export default Home;
