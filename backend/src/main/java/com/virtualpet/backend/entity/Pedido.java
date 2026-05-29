package com.virtualpet.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // Nombre del comprador (puede ser invitado)
    private String nombreCliente;
    private String emailCliente;
    private String telefonoCliente;
    private String direccionEntrega;

    private Double total;

    @Column(nullable = false)
    private String estado = "PENDIENTE"; // PENDIENTE, CONFIRMADO, ENVIADO, ENTREGADO, CANCELADO

    private String notas;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PedidoItem> items = new ArrayList<>();
}
