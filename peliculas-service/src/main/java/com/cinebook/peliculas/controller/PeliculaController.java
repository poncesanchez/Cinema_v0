package com.cinebook.peliculas.controller;

import com.cinebook.peliculas.dto.PeliculaRequest;
import com.cinebook.peliculas.dto.PeliculaResponse;
import com.cinebook.peliculas.service.PeliculaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/peliculas")
public class PeliculaController {

    private final PeliculaService service;

    public PeliculaController(PeliculaService service) {
        this.service = service;
    }

    @GetMapping
    public List<PeliculaResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public PeliculaResponse obtener(@PathVariable UUID id) {
        return service.obtener(id);
    }

    @PostMapping
    public ResponseEntity<PeliculaResponse> crear(@Valid @RequestBody PeliculaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(request));
    }

    @PutMapping("/{id}")
    public PeliculaResponse actualizar(@PathVariable UUID id, @Valid @RequestBody PeliculaRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
