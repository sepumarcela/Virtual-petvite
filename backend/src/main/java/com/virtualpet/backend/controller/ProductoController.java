package com.virtualpet.backend.controller;

import com.virtualpet.backend.entity.Producto;
import com.virtualpet.backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Endpoints públicos de productos:
 *   GET /productos/dto              → lista todos los activos (con filtro ?categoria=)
 *   GET /productos/{id}             → detalle por ID
 *   GET /productos/categorias       → lista de categorías únicas
 */
@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoRepository productoRepository;

    // GET /productos/dto?categoria=alimentos
    @GetMapping("/dto")
    public ResponseEntity<List<Producto>> getAll(
            @RequestParam(required = false) String categoria) {
        List<Producto> productos = productoRepository.findByFiltros(categoria);
        return ResponseEntity.ok(productos);
    }

    // GET /productos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getById(@PathVariable Long id) {
        return productoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /productos/categorias
    @GetMapping("/categorias")
    public ResponseEntity<List<Map<String, String>>> getCategorias() {
        List<String> cats = productoRepository.findCategorias();
        List<Map<String, String>> result = cats.stream()
                .map(c -> Map.of("id", c.toLowerCase(), "name", c))
                .toList();
        return ResponseEntity.ok(result);
    }
}
