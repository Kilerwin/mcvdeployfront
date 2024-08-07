import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from "../assets/img/MVC.png";
import { FormControl, Select, MenuItem, Alert } from '@mui/material';
import 'remixicon/fonts/remixicon.css';
import '../assets/css/login.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    genero: '',
  });
  const [generos, setGeneros] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Por favor ingrese un correo electrónico válido.');
      return;
    }


    if (formData.password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }


    if (!formData.genero) {
      setErrorMessage('Por favor seleccione un género.');
      return;
    }

    try {
      const userData = {
        ...formData,
        userCorreo: formData.email,
        userPassword: formData.password,
        userGenero: formData.genero,
        userRol: 2
      };
      console.log(userData)
      const response = await axios.post('https://mcv-backend-deploy.vercel.app/registro', userData);
      if (response.data.error) {
        setErrorMessage(response.data.error);
        setSuccessMessage('');
      } else {
        setSuccessMessage('Registro exitoso');
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage('Error al registrar su cuenta');
      setSuccessMessage('');
    }
  };


  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const response = await axios.get('https://mcv-backend-deploy.vercel.app/registro/genero');
        setGeneros(response.data);
      } catch (error) {
        console.error('Error al obtener los géneros:', error);
      }
    };

    fetchGeneros();
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <Box
        sx={{
          boxShadow: '0px 0px 30px 0px rgba(0,0,0,0.3)',
          padding: '19px',
          textAlign: 'center',
          borderRadius: '10px',
        }}
      >
        <div>
          <div className="login-content">
            <form id="loginForm" onSubmit={handleSubmit}>
              <img src={Logo} height="150" alt="" className='img-center' />
              <h4 className="" style={{ marginBottom: '5px' }}>Bienvenido !</h4>
              <p className="text-muted" style={{ marginBottom: '60px' }}>Obten tu cuenta Gratis.</p>
              <div className="login">
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}<br></br>
                <FormControl fullWidth={true} sx={{ marginBottom: 3 }}>
                  <TextField
                    label="Correo Electronico"
                    variant="outlined"
                    fullWidth
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl fullWidth={true} sx={{ marginBottom: 3 }}>
                  <InputLabel id="tipo-genero-label">Genero</InputLabel>
                  <Select
                    labelId="tipo-genero-label"
                    label="Genero"
                    fullWidth
                    value={formData.genero}
                    onChange={handleChange}
                    name="genero"
                    sx={{ textAlign: 'left' }}
                  >
                    {generos.map((generoObjeto, index) => (
                      <MenuItem key={index} value={generoObjeto.id_genero}>
                        {generoObjeto.genero}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth={true} sx={{ marginBottom: 2 }}>
                  <TextField
                    label="Contraseña"
                    variant="outlined"
                    fullWidth
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormControl>
                <input
                  className='btn'
                  type="submit"
                  value="Registrar"
                /><br />
                <div className='hover-link'>
                  <Link to="/login" sx={{ marginBottom: 2, textDecoration: "none", color: '#888' }} className='link-2' ><i className="ri-user-received-2-fill"></i>Ya tienes una cuenta?</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Box>
    </Grid>
  );
};

export default Registro;
