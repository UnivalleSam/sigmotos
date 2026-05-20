package com.sigmotos.usersservice.controller;

import com.sigmotos.usersservice.dto.AuthResponse;
import com.sigmotos.usersservice.dto.LoginRequest;
import com.sigmotos.usersservice.dto.RegisterRequest;
import com.sigmotos.usersservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}