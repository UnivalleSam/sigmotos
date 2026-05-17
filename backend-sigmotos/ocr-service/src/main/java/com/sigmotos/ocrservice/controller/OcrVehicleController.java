package com.sigmotos.ocrservice.controller;

import com.sigmotos.ocrservice.dto.VehicleDTO;
import com.sigmotos.ocrservice.service.OcrVehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/vehicles", "/api/ocr/vehicles"})
@RequiredArgsConstructor
public class OcrVehicleController {

    private final OcrVehicleService ocrVehicleService;

    @GetMapping("/search")
    public ResponseEntity<VehicleDTO> searchByPlate(@RequestParam String plate) {
        return ResponseEntity.ok(ocrVehicleService.searchByPlate(plate));
    }
}
