package com.virtualpet.backend.dto;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String username;
    private String password;

    public String resolvedEmail() {
        return email != null ? email : username;
    }
}
