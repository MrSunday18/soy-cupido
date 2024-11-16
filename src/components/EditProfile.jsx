import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Input, Button, Select, Text, useToast } from '@chakra-ui/react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function EditarPerfil() {
  const [perfil, setPerfil] = useState({});
  const [opciones, setOpciones] = useState({
    LookingFor: [],
    Children: [],
    EducationLevel: [],
    Occupation: [],
  });
  const toast = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/perfil/${user}`);
        const perfilData = {
          ...response.data,
        };
        setPerfil(perfilData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información del usuario.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    };

    const fetchOpciones = async () => {
      try {
        const response = await axios.get('http://localhost:5000/opciones');
        setOpciones(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo cargar las opciones.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    };

    fetchProfile();
    fetchOpciones();

  }, [toast, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerfil(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedPerfil = {
        ...perfil,
      };
      await axios.put(`http://localhost:5000/perfil/${user}/editar`, updatedPerfil);
      toast({
        title: 'Éxito',
        description: 'Perfil actualizado correctamente.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} bg="red.700" maxW="60%" mx="auto" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Text mb={4} fontSize="xl" fontWeight="bold">Editar Perfil</Text>
      
      <Text color="white" mb={1}>Email:</Text>
      <Input
        name="Email"
        value={perfil.Email || ''}
        onChange={handleInputChange}
        mb={3}
        bg="white"
        color="black"
        isReadOnly
      />

      <Text color="white" mb={1}>Edad:</Text>
      <Input
        name="Age"
        value={perfil.Age || ''}
        onChange={handleInputChange}
        mb={3}
        bg="white"
        color="black"
      />

      <Text color="white" mb={1}>Género:</Text>
      <Select
        name="Gender"
        value={perfil.Gender || ''}
        onChange={handleInputChange}
        mb={3}
        bg="white"
        color="black"
      >
        <option value="Male">Hombre</option>
        <option value="Female">Mujer</option>
      </Select>

      <Text color="white" mb={1}>Altura (cm):</Text>
      <Input
        name="Height"
        value={perfil.Height || ''}
        onChange={handleInputChange}
        mb={3}
        bg="white"
        color="black"
        type="number"
        min="0"
      />

      <Text color="white" mb={1}>Buscando:</Text>
      <Select
        name="Looking For"
        value={perfil['Looking For'] || ''}
        onChange={handleInputChange}
        mb={3}
        bg="white"
        color="black"
      >
        {opciones.LookingFor.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </Select>

      <Text color="white" mb={1}>Hijos:</Text>
      <Select
        name="Children"
        value={perfil.Children || ''}
        onChange={handleInputChange}
        mb={3}
        bg="white"
        color="black"
      >
        {opciones.Children.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </Select>

      <Text color="white" mb={1}>Nivel de Educación:</Text>
      <Select
        name="Education Level"
        value={perfil['Education Level'] || ''}
        onChange={handleInputChange}
        mb={3}
        bg="white"
        color="black"
      >
        {opciones.EducationLevel.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </Select>

      <Text color="white" mb={1}>Ocupación:</Text>
      <Select
        name="Occupation"
        value={perfil.Occupation || ''}
        onChange={handleInputChange}
        mb={3}
        bg="white"
        color="black"
      >
        {opciones.Occupation.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </Select>

      <Button colorScheme="teal" onClick={handleSave} width="full">
        Guardar Cambios
      </Button>
    </Box>
  );
}

export default EditarPerfil;
