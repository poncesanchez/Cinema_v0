import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { peliculasApi } from '../api/client';

const PLACEHOLDER = 'https://via.placeholder.com/300x450/1f1f1f/e50914?text=CineBook';

export default function Home() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const pelRes = await peliculasApi.listar();
        setPeliculas(pelRes.data);
      } catch {
        setError('No se pudo cargar la cartelera. Verifica que peliculas-service esté activo.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Cartelera
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {peliculas.length} películas en cartelera
      </Typography>

      <Grid container spacing={3}>
        {peliculas.map((pelicula) => (
          <Grid item key={pelicula.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea component={Link} to={`/pelicula/${pelicula.id}`}>
                <CardMedia
                  component="img"
                  height="320"
                  image={pelicula.imagenUrl || PLACEHOLDER}
                  alt={pelicula.titulo}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {pelicula.titulo}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <Chip label={pelicula.genero} size="small" />
                    <Chip label={pelicula.clasificacion} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {pelicula.duracion} min
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {peliculas.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No hay películas registradas. Agrega contenido desde Administración.
        </Alert>
      )}
    </>
  );
}
