package com.virtualpet.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "clientes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String telefono;

    private String direccion;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
