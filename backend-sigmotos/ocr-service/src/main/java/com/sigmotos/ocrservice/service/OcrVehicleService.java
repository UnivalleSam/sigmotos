package com.sigmotos.ocrservice.service;

import com.sigmotos.ocrservice.client.WorkshopClient;
import com.sigmotos.ocrservice.dto.VehicleDTO;
import com.sigmotos.ocrservice.exception.VehicleNotFoundException;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OcrVehicleService {

    private final WorkshopClient workshopClient;

    public VehicleDTO searchByPlate(String plate) {
        String normalizedPlate = formatPlate(plate);
        log.info("Buscando vehículo por placa OCR formateada: {}", normalizedPlate);

        try {
            return workshopClient.searchByPlate(normalizedPlate);
        } catch (FeignException.NotFound e) {
            log.warn("Vehículo no encontrado en workshop-service para placa: {}", normalizedPlate);
            throw new VehicleNotFoundException("Vehículo no registrado");
        } catch (Exception e) {
            log.error("Error al consultar workshop-service para placa {}: {}", normalizedPlate, e.getMessage());
            throw e;
        }
    }

    private String formatPlate(String plate) {
        if (plate == null) return "";
        return plate.replaceAll("[\\s\\-]", "").toUpperCase();
    }
}
