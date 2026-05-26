import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { peliculasApi } from '../api/client';

const peliculaVacia = {
  titulo: '',
  descripcion: '',
  duracion: 120,
  genero: '',
  clasificacion: 'TE',
  imagenUrl: '',
  fechaEstreno: '',
};

export default function Admin() {
  const [peliculas, setPeliculas] = useState([]);
  const [pelForm, setPelForm] = useState(peliculaVacia);
  const [editPelId, setEditPelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargar = async () => {
    setLoading(true);
    try {
      const pelRes = await peliculasApi.listar();
      setPeliculas(pelRes.data);
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al cargar datos.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardarPelicula = async (e) => {
    e.preventDefault();
    const payload = { ...pelForm, duracion: Number(pelForm.duracion) };
    try {
      if (editPelId) {
        await peliculasApi.actualizar(editPelId, payload);
      } else {
        await peliculasApi.crear(payload);
      }
      setPelForm(peliculaVacia);
      setEditPelId(null);
      setMensaje({ tipo: 'success', texto: 'Película guardada.' });
      cargar();
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al guardar película.' });
    }
  };

  const editarPelicula = (p) => {
    setEditPelId(p.id);
    setPelForm({
      titulo: p.titulo,
      descripcion: p.descripcion || '',
      duracion: p.duracion,
      genero: p.genero,
      clasificacion: p.clasificacion,
      imagenUrl: p.imagenUrl || '',
      fechaEstreno: p.fechaEstreno || '',
    });
  };

  const eliminarPelicula = async (id) => {
    await peliculasApi.eliminar(id);
    cargar();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Administración de películas
      </Typography>

      {mensaje.texto && (
        <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
          {mensaje.texto}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={guardarPelicula}>
          <Typography variant="h6" gutterBottom>
            {editPelId ? 'Editar película' : 'Nueva película'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField label="Título" value={pelForm.titulo} onChange={(e) => setPelForm({ ...pelForm, titulo: e.target.value })} required size="small" />
            <TextField label="Género" value={pelForm.genero} onChange={(e) => setPelForm({ ...pelForm, genero: e.target.value })} required size="small" />
            <TextField label="Clasificación" value={pelForm.clasificacion} onChange={(e) => setPelForm({ ...pelForm, clasificacion: e.target.value })} required size="small" />
            <TextField label="Duración (min)" type="number" value={pelForm.duracion} onChange={(e) => setPelForm({ ...pelForm, duracion: e.target.value })} required size="small" />
            <TextField label="URL imagen" value={pelForm.imagenUrl} onChange={(e) => setPelForm({ ...pelForm, imagenUrl: e.target.value })} size="small" sx={{ minWidth: 240 }} />
            <TextField label="Fecha estreno" type="date" value={pelForm.fechaEstreno} onChange={(e) => setPelForm({ ...pelForm, fechaEstreno: e.target.value })} InputLabelProps={{ shrink: true }} size="small" />
            <TextField label="Descripción" value={pelForm.descripcion} onChange={(e) => setPelForm({ ...pelForm, descripcion: e.target.value })} multiline rows={2} size="small" sx={{ width: '100%' }} />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained">Guardar</Button>
            {editPelId && (
              <Button onClick={() => { setEditPelId(null); setPelForm(peliculaVacia); }}>Cancelar</Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Género</TableCell>
            <TableCell>Duración</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {peliculas.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.titulo}</TableCell>
              <TableCell>{p.genero}</TableCell>
              <TableCell>{p.duracion} min</TableCell>
              <TableCell>
                <IconButton onClick={() => editarPelicula(p)} size="small"><EditIcon /></IconButton>
                <IconButton onClick={() => eliminarPelicula(p.id)} color="error" size="small"><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
