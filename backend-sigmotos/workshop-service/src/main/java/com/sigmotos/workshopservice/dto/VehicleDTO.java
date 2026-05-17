package com.sigmotos.workshopservice.dto;

import com.sigmotos.workshopservice.entity.Vehicle;

public record VehicleDTO(
        Long id,
        String plate,
        String brand,
        String model,
        Integer year,
        Long ownerId
) {
    public static VehicleDTO fromEntity(Vehicle vehicle) {
        return new VehicleDTO(
                vehicle.getId(),
                vehicle.getPlate(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getOwnerId()
        );
    }
}
