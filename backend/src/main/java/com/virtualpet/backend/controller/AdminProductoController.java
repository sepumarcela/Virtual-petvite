package com.virtualpet.backend.controller;

import com.virtualpet.backend.dto.PrecioRequest;
import com.virtualpet.backend.dto.ProductoRequest;
import com.virtualpet.backend.dto.StockRequest;
import com.virtualpet.backend.entity.Producto;
import com.virtualpet.backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints de administración de productos (requieren ROLE_ADMIN):
 *   GET    /api/admin/productos
 *   GET    /api/admin/productos/{id}
 *   POST   /api/admin/productos
 *   PUT    /api/admin/productos/{id}
 *   DELETE /api/admin/productos/{id}
 *   PATCH  /api/admin/productos/{id}/toggle
 *   PATCH  /api/admin/productos/{id}/precio
 *   PATCH  /api/admin/productos/{id}/stock
 */
@RestController
@RequestMapping("/api/admin/productos")
@RequiredArgsConstructor
public class AdminProductoController {

    private final ProductoRepository productoRepository;

    @GetMapping
    public Page<Producto> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return productoRepository.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getById(@PathVariable Long id) {
        return productoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Producto create(@RequestBody ProductoRequest req) {
        Producto p = toEntity(new Producto(), req);
        p.setActivo(req.getActivo() != null ? req.getActivo() : true);
        return productoRepository.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id,
                                           @RequestBody ProductoRequest req) {
        return productoRepository.findById(id)
                .map(existing -> {
                    toEntity(existing, req);
                    if (req.getActivo() != null) existing.setActivo(req.getActivo());
                    return ResponseEntity.ok(productoRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!productoRepository.existsById(id)) return ResponseEntity.notFound().build();
        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Producto> toggle(@PathVariable Long id) {
        return productoRepository.findById(id)
                .map(p -> {
                    p.setActivo(!p.getActivo());
                    return ResponseEntity.ok(productoRepository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/precio")
    public ResponseEntity<Producto> updatePrecio(@PathVariable Long id,
                                                 @RequestBody PrecioRequest req) {
        return productoRepository.findById(id)
                .map(p -> {
                    p.setPrecio(req.getPrecio());
                    return ResponseEntity.ok(productoRepository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Producto> updateStock(@PathVariable Long id,
                                                @RequestBody StockRequest req) {
        return productoRepository.findById(id)
                .map(p -> {
                    p.setStock(req.getStock());
                    return ResponseEntity.ok(productoRepository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Helper ────────────────────────────────────────────────
    private Producto toEntity(Producto p, ProductoRequest req) {
        if (req.getReferencia()    != null) p.setReferencia(req.getReferencia());
        if (req.getNombre()        != null) p.setNombre(req.getNombre());
        if (req.getMarca()         != null) p.setMarca(req.getMarca());
        if (req.getCategoria()     != null) p.setCategoria(req.getCategoria());
        if (req.getDescripcion()   != null) p.setDescripcion(req.getDescripcion());
        if (req.getPrecio()        != null) p.setPrecio(req.getPrecio());
        if (req.getStock()         != null) p.setStock(req.getStock());
        if (req.getEspecie()       != null) p.setEspecie(req.getEspecie());
        if (req.getPresentaciones()!= null) p.setPresentaciones(req.getPresentaciones());
        if (req.getImagenUrl()     != null) p.setImagenUrl(req.getImagenUrl());
        if (req.getSubtitle()      != null) p.setSubtitle(req.getSubtitle());
        if (req.getTarget()        != null) p.setTarget(req.getTarget());
        if (req.getType()          != null) p.setType(req.getType());
        if (req.getDisponibilidad()!= null) p.setDisponibilidad(req.getDisponibilidad());
        return p;
    }
}
