package com.virtualpet.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class AdminUserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
}
