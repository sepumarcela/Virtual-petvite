package com.virtualpet.backend.controller;

import com.virtualpet.backend.dto.EstadoRequest;
import com.virtualpet.backend.entity.Pedido;
import com.virtualpet.backend.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints de administración de pedidos (requieren ROLE_ADMIN):
 *   GET   /api/admin/pedidos
 *   PATCH /api/admin/pedidos/{id}/estado
 */
@RestController
@RequestMapping("/api/admin/pedidos")
@RequiredArgsConstructor
public class AdminPedidoController {

    private final PedidoRepository pedidoRepository;

    @GetMapping
    public Page<Pedido> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return pedidoRepository.findAll(PageRequest.of(page, size));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Pedido> updateEstado(@PathVariable Long id,
                                               @RequestBody EstadoRequest req) {
        return pedidoRepository.findById(id)
                .map(p -> {
                    p.setEstado(req.getEstado());
                    return ResponseEntity.ok(pedidoRepository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
