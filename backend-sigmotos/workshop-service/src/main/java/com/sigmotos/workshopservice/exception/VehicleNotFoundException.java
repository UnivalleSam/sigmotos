package com.sigmotos.workshopservice.exception;

public class VehicleNotFoundException extends RuntimeException {

    public VehicleNotFoundException(Long id) {
        super("No se encontró el vehículo con id: " + id);
    }
}
