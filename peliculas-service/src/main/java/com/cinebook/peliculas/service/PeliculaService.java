package com.cinebook.peliculas.service;

import com.cinebook.peliculas.dto.PeliculaRequest;
import com.cinebook.peliculas.dto.PeliculaResponse;
import com.cinebook.peliculas.entity.Pelicula;
import com.cinebook.peliculas.exception.ResourceNotFoundException;
import com.cinebook.peliculas.repository.PeliculaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PeliculaService {

    private final PeliculaRepository repository;

    public PeliculaService(PeliculaRepository repository) {
        this.repository = repository;
    }

    public List<PeliculaResponse> listar() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public PeliculaResponse obtener(UUID id) {
        return toResponse(findById(id));
    }

    public PeliculaResponse crear(PeliculaRequest request) {
        Pelicula pelicula = new Pelicula();
        pelicula.setId(UUID.randomUUID());
        mapRequest(pelicula, request);
        return toResponse(repository.save(pelicula));
    }

    public PeliculaResponse actualizar(UUID id, PeliculaRequest request) {
        Pelicula pelicula = findById(id);
        mapRequest(pelicula, request);
        return toResponse(repository.save(pelicula));
    }

    public void eliminar(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Película no encontrada");
        }
        repository.deleteById(id);
    }

    private Pelicula findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Película no encontrada"));
    }

    private void mapRequest(Pelicula pelicula, PeliculaRequest request) {
        pelicula.setTitulo(request.getTitulo());
        pelicula.setDescripcion(request.getDescripcion());
        pelicula.setDuracion(request.getDuracion());
        pelicula.setGenero(request.getGenero());
        pelicula.setClasificacion(request.getClasificacion());
        pelicula.setImagenUrl(request.getImagenUrl());
        pelicula.setFechaEstreno(request.getFechaEstreno());
    }

    private PeliculaResponse toResponse(Pelicula pelicula) {
        PeliculaResponse response = new PeliculaResponse();
        response.setId(pelicula.getId());
        response.setTitulo(pelicula.getTitulo());
        response.setDescripcion(pelicula.getDescripcion());
        response.setDuracion(pelicula.getDuracion());
        response.setGenero(pelicula.getGenero());
        response.setClasificacion(pelicula.getClasificacion());
        response.setImagenUrl(pelicula.getImagenUrl());
        response.setFechaEstreno(pelicula.getFechaEstreno());
        return response;
    }
}
