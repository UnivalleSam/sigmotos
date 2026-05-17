package com.sigmotos.workshopservice.service;

import com.sigmotos.workshopservice.client.UserClient;
import com.sigmotos.workshopservice.dto.UserDTO;
import com.sigmotos.workshopservice.dto.VehicleDTO;
import com.sigmotos.workshopservice.entity.Vehicle;
import com.sigmotos.workshopservice.exception.PlateAlreadyExistsException;
import com.sigmotos.workshopservice.exception.VehicleNotFoundException;
import com.sigmotos.workshopservice.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserClient userClient;

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
        String ownerName = "Cliente no encontrado";
        try {
            UserDTO user = userClient.getUserById(vehicle.getOwnerId());
            if (user != null) {
                ownerName = user.getName();
            }
        } catch (Exception e) {
            log.warn("No se pudo obtener el nombre del cliente de users-service para ownerId {}. Detalle: {}", 
                     vehicle.getOwnerId(), e.getMessage());
            ownerName = "Cliente SIGMOTOS (Offline)";
        }

        return VehicleDTO.builder()
                .id(vehicle.getId())
                .plate(vehicle.getPlate())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .ownerId(vehicle.getOwnerId())
                .ownerName(ownerName)
                .build();
    }
}
