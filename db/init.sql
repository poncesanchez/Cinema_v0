-- Esquema y datos de demostración (solo películas)

CREATE TABLE IF NOT EXISTS peliculas (
    id UUID PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion VARCHAR(2000),
    duracion INTEGER NOT NULL,
    genero VARCHAR(100) NOT NULL,
    clasificacion VARCHAR(20) NOT NULL,
    imagen_url VARCHAR(500),
    fecha_estreno DATE
);

INSERT INTO peliculas (id, titulo, descripcion, duracion, genero, clasificacion, imagen_url, fecha_estreno)
VALUES
(
    'b2222222-2222-2222-2222-222222222222',
    'Dune: Parte Dos',
    'Paul Atreides se une a los Fremen para vengar la destrucción de su familia.',
    166,
    'Ciencia ficción',
    'TE',
    'https://m.media-amazon.com/images/M/MV5BNzBiMTQ0YjMtZDRhMC00ZDU4LTk3MDMtNWQxOGMwMjQzYjc4XkEyXkFqcGc@._V1_.jpg',
    '2024-02-29'
),
(
    'c3333333-3333-3333-3333-333333333333',
    'Inside Out 2',
    'Riley entra en la adolescencia y nuevas emociones llegan a su mente.',
    96,
    'Animación',
    'TE',
    'https://m.media-amazon.com/images/M/MV5BYWY3MDE2Y2UtOTE3Zi00MGUzLTg2MTItZjE1ZWVkMGVlODRmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    '2024-06-12'
) ON CONFLICT (id) DO NOTHING;
