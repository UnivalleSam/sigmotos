package com.sigmotos.workshopservice.controller;

import com.sigmotos.workshopservice.dto.VehicleDTO;
import com.sigmotos.workshopservice.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    // POST /api/vehicles — Registrar un nuevo vehículo
    @PostMapping
    public ResponseEntity<VehicleDTO> register(@Valid @RequestBody VehicleDTO dto) {
        VehicleDTO created = vehicleService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET /api/vehicles/{id} — Obtener vehículo por ID
    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.findById(id));
    }

    // GET /api/vehicles/search?plate={plate} — Buscar por placa (usado por OCR)
    @GetMapping("/search")
    public ResponseEntity<VehicleDTO> searchByPlate(@RequestParam String plate) {
        return ResponseEntity.ok(vehicleService.searchByPlate(plate));
    }
}
