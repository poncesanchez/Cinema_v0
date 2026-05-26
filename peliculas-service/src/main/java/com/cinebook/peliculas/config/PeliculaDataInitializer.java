package com.cinebook.peliculas.config;

import com.cinebook.peliculas.entity.Pelicula;
import com.cinebook.peliculas.repository.PeliculaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.UUID;

@Configuration
public class PeliculaDataInitializer {

    @Bean
    CommandLineRunner seedPeliculas(PeliculaRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            repository.save(pelicula(
                    UUID.fromString("b2222222-2222-2222-2222-222222222222"),
                    "Dune: Parte Dos",
                    "Paul Atreides se une a los Fremen para vengar la destrucción de su familia.",
                    166,
                    "Ciencia ficción",
                    "TE",
                    "https://m.media-amazon.com/images/M/MV5BNzBiMTQ0YjMtZDRhMC00ZDU4LTk3MDMtNWQxOGMwMjQzYjc4XkEyXkFqcGc@._V1_.jpg",
                    LocalDate.of(2024, 2, 29)
            ));

            repository.save(pelicula(
                    UUID.fromString("c3333333-3333-3333-3333-333333333333"),
                    "Inside Out 2",
                    "Riley entra en la adolescencia y nuevas emociones llegan a su mente.",
                    96,
                    "Animación",
                    "TE",
                    "https://m.media-amazon.com/images/M/MV5BYWY3MDE2Y2UtOTE3Zi00MGUzLTg2MTItZjE1ZWVkMGVlODRmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                    LocalDate.of(2024, 6, 12)
            ));
        };
    }

    private static Pelicula pelicula(
            UUID id,
            String titulo,
            String descripcion,
            int duracion,
            String genero,
            String clasificacion,
            String imagenUrl,
            LocalDate fechaEstreno
    ) {
        Pelicula pelicula = new Pelicula();
        pelicula.setId(id);
        pelicula.setTitulo(titulo);
        pelicula.setDescripcion(descripcion);
        pelicula.setDuracion(duracion);
        pelicula.setGenero(genero);
        pelicula.setClasificacion(clasificacion);
        pelicula.setImagenUrl(imagenUrl);
        pelicula.setFechaEstreno(fechaEstreno);
        return pelicula;
    }
}
