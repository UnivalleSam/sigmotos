package com.sigmotos.workshopservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Year;

public record CreateVehicleRequest(
        @NotBlank(message = "La placa es obligatoria")
        @Size(max = 20, message = "La placa no puede superar 20 caracteres")
        String plate,

        @NotBlank(message = "La marca es obligatoria")
        @Size(max = 50, message = "La marca no puede superar 50 caracteres")
        String brand,

        @NotBlank(message = "El modelo es obligatorio")
        @Size(max = 50, message = "El modelo no puede superar 50 caracteres")
        String model,

        @NotNull(message = "El año es obligatorio")
        @Min(value = 1900, message = "El año debe ser mayor o igual a 1900")
        Integer year,

        @NotNull(message = "El ownerId es obligatorio")
        Long ownerId
) {
    public CreateVehicleRequest {
        if (year != null && year > Year.now().getValue() + 1) {
            throw new IllegalArgumentException("El año no puede ser mayor al año siguiente al actual");
        }
    }
}
