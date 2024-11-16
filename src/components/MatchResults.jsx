import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight, FaUser } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const emojis_por_interes = {
  "Deportes": "⚽",
  "Cocina": "🍳",
  "Senderismo": "🥾",
  "Música": "🎵",
  "Cine": "🎬",
  "Lectura": "📚",
  "Viajar": "✈️",
  "Sí":"✅",
  "No":"❎"
};

const replaceWithEmojis = (text) => {
  const sortedKeys = Object.keys(emojis_por_interes).sort((a, b) => b.length - a.length);
  sortedKeys.forEach(key => {
      const regex = new RegExp('\\b' + key + '\\b', 'gi');
      text = text.replace(regex, emojis_por_interes[key]);
  });
  return text;
};

const MatchResults = () => {
  const { user } = useAuth();
  const { userID } = useParams();
  const [matches, setMatches] = useState([]);
  const [perfilId, setPerfilId] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userID && parseInt(userID) !== parseInt(user)) {
      navigate(`/match-results/${user}`);
    } else {
      setPerfilId(user.toString());
    }
  }, [userID, user, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchMatches = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/perfil/${user}/coincidencias`);
        const processedMatches = response.data.map(match => ({
          ...match,
          Motivos: replaceWithEmojis(match.Motivos)
        }));
        setMatches(processedMatches);
        setActiveIndex(0);
      } catch (err) {
        toast({
          title: "Error al cargar los perfiles",
          description: err.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    fetchMatches();
  }, [user, toast, navigate, perfilId]);

  const handlePrevProfile = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextProfile = () => {
    setActiveIndex((prev) => (prev < matches.length - 1 ? prev + 1 : prev));
  };

  return (
    <Box p={5} bg="red.700" maxW="80%" mx="auto" borderWidth="1px" borderRadius="lg" overflow="hidden" height="500px">
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        <GridItem w='100%' h='100%' >
          <IconButton
            icon={<FaArrowLeft />}
            aria-label="Perfil anterior"
            onClick={handlePrevProfile}
            isDisabled={activeIndex === 0}
          />
        </GridItem>
        <GridItem w='100%' h='100%' >
          <Box borderWidth="1px" borderRadius="lg" p={3} borderColor="gray.200" mb={4}>
            <Text fontWeight="bold" fontSize="lg">
              Edad: {matches[activeIndex]?.Edad}
            </Text>
          </Box>
          <Box borderWidth="1px" borderRadius="lg" p={3} borderColor="gray.200">
            <Text fontWeight="bold" fontSize="lg">
              Sexo: {matches[activeIndex]?.Sexo}
            </Text>
          </Box>
        </GridItem>
        <GridItem w='100%' h='100%' display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Flex bg="red.200" borderRadius="full" w="100px" h="100px" align="center" justify="center">
            <FaUser size="60px" />
          </Flex>
          <Text fontWeight="bold" fontSize="lg" mt={2}>
            Perfil ID: {matches[activeIndex]?.perfil_id}
          </Text>
          <Text fontWeight="bold" fontSize="lg">
            Puntaje: {matches[activeIndex]?.puntaje}
          </Text>
        </GridItem>
        <GridItem w='100%' h='100%' >
          <Box borderWidth="1px" borderRadius="lg" p={3} borderColor="gray.200" mb={4}>
            <Text fontWeight="bold" fontSize="lg">
              Hijos: {matches[activeIndex]?.Hijos}
            </Text>
          </Box>
          <Box borderWidth="1px" borderRadius="lg" p={3} borderColor="gray.200" mb={4}>
            <Text fontWeight="bold" fontSize="lg">
              Relación: {matches[activeIndex]?.Relacion}
            </Text>
          </Box>
        </GridItem>
        <GridItem w='100%' h='100%' >
          <IconButton
            icon={<FaArrowRight />}
            aria-label="Siguiente perfil"
            onClick={handleNextProfile}
            isDisabled={activeIndex === matches.length - 1}
          />
        </GridItem>
      </Grid>
      <Box mt={4} bg="red.500" p={4} borderRadius="md" height="200px">
        <Text fontSize="xl" fontWeight="bold">Motivos:</Text>
        <Text fontSize="xl">{matches[activeIndex]?.Motivos}</Text>
      </Box>
    </Box>
  );
};

export default MatchResults;
