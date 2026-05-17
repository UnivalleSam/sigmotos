package com.sigmotos.workshopservice.service;

import com.sigmotos.workshopservice.dto.VehicleDTO;
import com.sigmotos.workshopservice.entity.Vehicle;
import com.sigmotos.workshopservice.exception.PlateAlreadyExistsException;
import com.sigmotos.workshopservice.exception.VehicleNotFoundException;
import com.sigmotos.workshopservice.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleDTO register(VehicleDTO dto) {
        String normalizedPlate = formatPlate(dto.getPlate());

        if (vehicleRepository.existsByPlateIgnoreCase(normalizedPlate)) {
            throw new PlateAlreadyExistsException("La placa '" + normalizedPlate + "' ya está registrada");
        }

        Vehicle vehicle = Vehicle.builder()
                .plate(normalizedPlate)
                .brand(dto.getBrand())
                .model(dto.getModel())
                .year(dto.getYear())
                .ownerId(dto.getOwnerId())
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        return toDTO(saved);
    }

    public VehicleDTO findById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehículo no registrado con ID: " + id));
        return toDTO(vehicle);
    }

    public VehicleDTO searchByPlate(String plate) {
        String normalizedPlate = formatPlate(plate);

        Vehicle vehicle = vehicleRepository.findByPlateIgnoreCase(normalizedPlate)
                .orElseThrow(() -> new VehicleNotFoundException("Vehículo no registrado"));
        return toDTO(vehicle);
    }

    // Elimina espacios y guiones, convierte a mayúsculas
    private String formatPlate(String plate) {
        if (plate == null) return "";
        return plate.replaceAll("[\\s\\-]", "").toUpperCase();
    }

    private VehicleDTO toDTO(Vehicle vehicle) {
        return VehicleDTO.builder()
                .id(vehicle.getId())
                .plate(vehicle.getPlate())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .ownerId(vehicle.getOwnerId())
                .build();
    }
}
