package com.virtualpet.backend.dto;
import lombok.Data;
import java.util.List;

@Data
public class PedidoRequest {
    private Long clienteId;
    private String nombreCliente;
    private String emailCliente;
    private String telefonoCliente;
    private String direccionEntrega;
    private String notas;
    private List<PedidoItemRequest> items;
}
