import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Input,
  Button,
  Select,
  CheckboxGroup,
  Checkbox,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
    Age: '',
    Gender: '',
    Height: '',
    Interests: [],
    LookingFor: '',
    Children: '',
    EducationLevel: '',
    Occupation: '',
  });

  const [opciones, setOpciones] = useState({
    Interests: [],
    LookingFor: [],
    Children: [],
    EducationLevel: [],
    Occupation: [],
  });

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
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

    fetchOpciones();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (selectedValues) => {
    setFormData((prevState) => ({
      ...prevState,
      Interests: selectedValues,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/registro', formData)
      .then(response => {
        const { userID } = response.data;
        toast({
          title: "Registro exitoso",
          description: "Usuario registrado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate(`/match-results/${userID}`);
      })
      .catch(error => {
        toast({
          title: "Error al registrar usuario",
          description: error.response?.data?.error || 'Error desconocido al registrar usuario',
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <Box p={5} bg="red.700" maxW="60%" mx="auto" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Text mb={4} fontSize="xl" fontWeight="bold">Registro</Text>
      <form onSubmit={handleSubmit}>
        <Input
          name="Email"
          placeholder="Correo electrónico"
          value={formData.Email}
          onChange={handleInputChange}
          mb={3}
          bg="white"
          color="black"
        />
        <Input
          name="Password"
          placeholder="Contraseña"
          value={formData.Password}
          onChange={handleInputChange}
          mb={3}
          bg="white"
          color="black"
          type="password"
        />
        <Input
          name="Age"
          placeholder="Edad"
          value={formData.Age}
          onChange={handleInputChange}
          mb={3}
          bg="white"
          color="black"
        />
        <Select
          name="Gender"
          placeholder="Selecciona tu género"
          value={formData.Gender}
          onChange={handleInputChange}
          mb={3}
          bg="white"
          color="black"
        >
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
        </Select>
        <Input
          name="Height"
          placeholder="Altura en centímetros"
          value={formData.Height}
          onChange={handleInputChange}
          mb={3}
          bg="white"
          color="black"
          type="number"
          min="0"
        />
        <CheckboxGroup
          colorScheme="teal"
          value={formData.Interests}
          onChange={handleCheckboxChange}
          mb={3}
        >
          <Text color="white" mb={2}>Intereses:</Text>
          <HStack align="start" spacing={5}>
            {opciones.Interests.map((interest, idx) => (
              <Checkbox key={idx} value={interest}>
                {interest}
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
        <Select
          name="LookingFor"
          placeholder="¿Qué estás buscando?"
          value={formData.LookingFor}
          onChange={handleInputChange}
          mb={3}
          bg="white"
          color="black"
        >
          {opciones.LookingFor.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </Select>
        <Select
          name="Children"
          placeholder="¿Tienes hijos?"
          value={formData.Children}
          onChange={handleInputChange}
          mb={3}
          bg="white"
          color="black"
        >
          {opciones.Children.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </Select>
        <Select
          name="EducationLevel"
          placeholder="Nivel de educación"
          value={formData.EducationLevel}
          onChange={handleInputChange}
          mb={3}
          bg="white"
          color="black"
        >
          {opciones.EducationLevel.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </Select>
        <Select
          name="Occupation"
          placeholder="Ocupación"
          value={formData.Occupation}
          onChange={handleInputChange}
          mb={3}
          bg="white"
          color="black"
        >
          {opciones.Occupation.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </Select>
        <Button colorScheme="teal" type="submit" width="full">
          Registrarse
        </Button>
      </form>
    </Box>
  );
}

export default Register;
