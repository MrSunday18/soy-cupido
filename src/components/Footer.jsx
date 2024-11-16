import React from 'react';
import { Box, Text} from '@chakra-ui/react';

function Footer() {
  return (
    <Box as="footer" bg="teal.500" color="white" py={4} textAlign="center" mt={10}>
      <Text>&copy; {new Date().getFullYear()} Soy Cupido. Todos los derechos reservados.</Text>
    </Box>
  );
}

export default Footer;
