package com.virtualpet.backend.controller;

import com.virtualpet.backend.dto.AdminUserDto;
import com.virtualpet.backend.dto.LoginRequest;
import com.virtualpet.backend.dto.LoginResponse;
import com.virtualpet.backend.entity.AdminUser;
import com.virtualpet.backend.repository.AdminUserRepository;
import com.virtualpet.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    // POST /api/admin/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String email = req.resolvedEmail();

        AdminUser admin = adminUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(req.getPassword(), admin.getPassword())) {
            return ResponseEntity.status(401)
                    .body(java.util.Map.of("message", "Credenciales inválidas. Intenta de nuevo."));
        }

        String token = jwtUtils.generateToken(admin.getEmail(), admin.getRole());
        AdminUserDto userDto = new AdminUserDto(admin.getId(), admin.getNombre(), admin.getEmail(), admin.getRole());
        return ResponseEntity.ok(new LoginResponse(token, userDto));
    }

    // GET /api/admin/auth/me
    @GetMapping("/me")
    public ResponseEntity<?> me(Principal principal) {
        AdminUser admin = adminUserRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(new AdminUserDto(admin.getId(), admin.getNombre(), admin.getEmail(), admin.getRole()));
    }
}
