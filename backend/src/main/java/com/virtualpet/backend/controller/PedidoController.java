package com.virtualpet.backend.controller;

import com.virtualpet.backend.dto.PedidoItemRequest;
import com.virtualpet.backend.dto.PedidoRequest;
import com.virtualpet.backend.entity.Pedido;
import com.virtualpet.backend.entity.PedidoItem;
import com.virtualpet.backend.entity.Producto;
import com.virtualpet.backend.repository.PedidoRepository;
import com.virtualpet.backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Endpoints públicos de pedidos:
 *   GET  /pedidos       → lista todos
 *   GET  /pedidos/{id}  → por ID
 *   POST /pedidos       → crear
 */
@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    @GetMapping
    public List<Pedido> getAll() {
        return pedidoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getById(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pedido create(@RequestBody PedidoRequest req) {
        Pedido pedido = Pedido.builder()
                .nombreCliente(req.getNombreCliente())
                .emailCliente(req.getEmailCliente())
                .telefonoCliente(req.getTelefonoCliente())
                .direccionEntrega(req.getDireccionEntrega())
                .notas(req.getNotas())
                .estado("PENDIENTE")
                .items(new ArrayList<>())
                .build();

        double total = 0;
        if (req.getItems() != null) {
            for (PedidoItemRequest itemReq : req.getItems()) {
                Producto producto = itemReq.getProductoId() != null
                        ? productoRepository.findById(itemReq.getProductoId()).orElse(null)
                        : null;

                PedidoItem item = PedidoItem.builder()
                        .pedido(pedido)
                        .producto(producto)
                        .nombreProducto(itemReq.getNombreProducto())
                        .precioUnitario(itemReq.getPrecioUnitario())
                        .cantidad(itemReq.getCantidad())
                        .subtotal(itemReq.getPrecioUnitario() * itemReq.getCantidad())
                        .build();

                pedido.getItems().add(item);
                total += item.getSubtotal();
            }
        }
        pedido.setTotal(total);
        return pedidoRepository.save(pedido);
    }
}
