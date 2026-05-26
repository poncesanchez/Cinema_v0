import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { peliculasApi } from '../api/client';

export default function PeliculaDetail() {
  const { id } = useParams();
  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const pelRes = await peliculasApi.obtener(id);
        setPelicula(pelRes.data);
      } catch {
        setError('No se pudo cargar la película.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !pelicula) {
    return <Alert severity="error">{error || 'Película no encontrada'}</Alert>;
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        <Box
          component="img"
          src={pelicula.imagenUrl || 'https://via.placeholder.com/400x600'}
          alt={pelicula.titulo}
          sx={{ width: '100%', borderRadius: 2 }}
        />
      </Grid>
      <Grid item xs={12} md={7}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          {pelicula.titulo}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label={pelicula.genero} />
          <Chip label={pelicula.clasificacion} variant="outlined" />
          <Chip label={`${pelicula.duracion} min`} variant="outlined" />
        </Box>
        <Typography variant="body1" paragraph color="text.secondary">
          {pelicula.descripcion || 'Sin descripción disponible.'}
        </Typography>
        {pelicula.fechaEstreno && (
          <Typography variant="body2" color="text.secondary">
            Estreno: {pelicula.fechaEstreno}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
