package com.sigmotos.usersservice.controller;

import com.sigmotos.usersservice.dto.UserDTO;
import com.sigmotos.usersservice.entity.User;
import com.sigmotos.usersservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(
                        UserDTO.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .build()
                ))
                .orElse(ResponseEntity.notFound().build());
    }
}
