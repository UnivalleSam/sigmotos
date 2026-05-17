package com.sigmotos.workshopservice.controller;

import com.sigmotos.workshopservice.dto.CreateVehicleRequest;
import com.sigmotos.workshopservice.dto.VehicleDTO;
import com.sigmotos.workshopservice.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<VehicleDTO> register(@Valid @RequestBody CreateVehicleRequest request) {
        VehicleDTO created = vehicleService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.findById(id));
    }
}
