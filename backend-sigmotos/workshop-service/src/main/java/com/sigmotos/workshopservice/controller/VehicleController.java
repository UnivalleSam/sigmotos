package com.sigmotos.workshopservice.controller;

import com.sigmotos.workshopservice.dto.VehicleDTO;
import com.sigmotos.workshopservice.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    // POST /api/vehicles — Registrar un nuevo vehículo
    @PostMapping
    public ResponseEntity<VehicleDTO> register(@Valid @RequestBody VehicleDTO dto) {
        VehicleDTO created = vehicleService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET /api/vehicles — Listar todos los vehículos
    @GetMapping
    public ResponseEntity<List<VehicleDTO>> findAll() {
        return ResponseEntity.ok(vehicleService.findAll());
    }

    // GET /api/vehicles/{id} — Obtener vehículo por ID
    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.findById(id));
    }

    // GET /api/vehicles/owner/{ownerId} — Listar vehículos por propietario
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<VehicleDTO>> findByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(vehicleService.findByOwnerId(ownerId));
    }

    // GET /api/vehicles/search?plate={plate} — Buscar por placa (usado por OCR)
    @GetMapping("/search")
    public ResponseEntity<VehicleDTO> searchByPlate(@RequestParam String plate) {
        return ResponseEntity.ok(vehicleService.searchByPlate(plate));
    }
}
