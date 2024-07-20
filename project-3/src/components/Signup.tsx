import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Box,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledContainer = styled(Container)({
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "2rem",
  borderRadius: "15px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
});

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    promotionalEmails: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <StyledContainer maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Cadastrar
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="Nome"
            name="firstName"
            autoComplete="fname"
            autoFocus
            value={formData.firstName}
            onChange={handleChange}
            sx={{ borderRadius: "5px", backgroundColor: "white" }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Sobrenome"
            name="lastName"
            autoComplete="lname"
            value={formData.lastName}
            onChange={handleChange}
            sx={{ borderRadius: "5px", backgroundColor: "white" }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ borderRadius: "5px", backgroundColor: "white" }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            sx={{ borderRadius: "5px", backgroundColor: "white" }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="promotionalEmails"
                color="primary"
                checked={formData.promotionalEmails}
                onChange={handleChange}
              />
            }
            label="Aceito receber informações promocionais"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              mb: 2,
              padding: "10px 0",
              borderRadius: "5px",
              backgroundColor: "#1976d2",
              ":hover": { backgroundColor: "#115293" },
            }}
          >
            Cadastrar
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Já tem uma conta? Faça login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default Signup;
