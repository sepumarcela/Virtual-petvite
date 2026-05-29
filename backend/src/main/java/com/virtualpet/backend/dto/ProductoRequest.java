package com.virtualpet.backend.dto;
import lombok.Data;

@Data
public class ProductoRequest {
    private String referencia;
    private String nombre;
    private String marca;
    private String categoria;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String especie;
    private String presentaciones;
    private String imagenUrl;
    private String subtitle;
    private String target;
    private String type;
    private String disponibilidad;
    private Boolean activo;
}
