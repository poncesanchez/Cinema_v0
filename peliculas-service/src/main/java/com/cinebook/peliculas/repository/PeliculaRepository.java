package com.cinebook.peliculas.repository;

import com.cinebook.peliculas.entity.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PeliculaRepository extends JpaRepository<Pelicula, UUID> {
}
