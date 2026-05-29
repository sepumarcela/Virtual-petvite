package com.virtualpet.backend.dto;
import lombok.Data;

@Data
public class PedidoItemRequest {
    private Long productoId;
    private String nombreProducto;
    private Double precioUnitario;
    private Integer cantidad;
}
