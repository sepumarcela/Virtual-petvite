package com.virtualpet.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "productos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String referencia;

    @Column(nullable = false)
    private String nombre;

    private String marca;

    private String categoria;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private Double precio;

    private Integer stock;

    private String especie;

    private String presentaciones;

    private String imagenUrl;

    private String subtitle;

    private String target;

    private String type;

    @Column(name = "disponibilidad")
    private String disponibilidad = "DISPONIBLE";

    @Column(nullable = false)
    private Boolean activo = true;
}
