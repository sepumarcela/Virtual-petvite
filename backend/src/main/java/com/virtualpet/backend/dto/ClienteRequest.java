package com.virtualpet.backend.dto;
import lombok.Data;

@Data
public class ClienteRequest {
    private String nombre;
    private String email;
    private String password;
    private String telefono;
    private String direccion;
}
