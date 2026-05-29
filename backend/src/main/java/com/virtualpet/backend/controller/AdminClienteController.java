package com.virtualpet.backend.controller;

import com.virtualpet.backend.entity.Cliente;
import com.virtualpet.backend.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints de administración de clientes (requieren ROLE_ADMIN):
 *   GET   /api/admin/clientes
 *   GET   /api/admin/clientes/{id}
 *   PATCH /api/admin/clientes/{id}/toggle
 */
@RestController
@RequestMapping("/api/admin/clientes")
@RequiredArgsConstructor
public class AdminClienteController {

    private final ClienteRepository clienteRepository;

    @GetMapping
    public Page<Cliente> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return clienteRepository.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getById(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Cliente> toggle(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .map(c -> {
                    c.setActivo(!c.getActivo());
                    return ResponseEntity.ok(clienteRepository.save(c));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
