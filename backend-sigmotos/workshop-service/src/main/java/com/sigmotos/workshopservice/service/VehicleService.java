package com.sigmotos.workshopservice.service;

import com.sigmotos.workshopservice.dto.CreateVehicleRequest;
import com.sigmotos.workshopservice.dto.VehicleDTO;
import com.sigmotos.workshopservice.entity.Vehicle;
import com.sigmotos.workshopservice.exception.DuplicatePlateException;
import com.sigmotos.workshopservice.exception.VehicleNotFoundException;
import com.sigmotos.workshopservice.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    @Transactional
    public VehicleDTO register(CreateVehicleRequest request) {
        String normalizedPlate = request.plate().trim().toUpperCase();

        if (vehicleRepository.existsByPlateIgnoreCase(normalizedPlate)) {
            throw new DuplicatePlateException(normalizedPlate);
        }

        Vehicle vehicle = Vehicle.builder()
                .plate(normalizedPlate)
                .brand(request.brand().trim())
                .model(request.model().trim())
                .year(request.year())
                .ownerId(request.ownerId())
                .build();

        return VehicleDTO.fromEntity(vehicleRepository.save(vehicle));
    }

    @Transactional(readOnly = true)
    public VehicleDTO findById(Long id) {
        return vehicleRepository.findById(id)
                .map(VehicleDTO::fromEntity)
                .orElseThrow(() -> new VehicleNotFoundException(id));
    }
}
