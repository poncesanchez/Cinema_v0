import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PeliculaDetail from './pages/PeliculaDetail';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pelicula/:id" element={<PeliculaDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Layout>
  );
}
