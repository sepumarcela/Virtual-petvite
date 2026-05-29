package com.virtualpet.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class LoginResponse {
    private String token;
    private AdminUserDto user;
}
