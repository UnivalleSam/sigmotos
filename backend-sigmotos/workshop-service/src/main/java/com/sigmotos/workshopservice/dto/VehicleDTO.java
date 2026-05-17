package com.sigmotos.workshopservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {

    private Long id;

    @NotBlank(message = "La placa es obligatoria")
    @Size(max = 10, message = "La placa no puede superar 10 caracteres")
    private String plate;

    @NotBlank(message = "La marca es obligatoria")
    private String brand;

    @NotBlank(message = "El modelo es obligatorio")
    private String model;

    @NotNull(message = "El año es obligatorio")
    @Min(value = 1900, message = "El año debe ser mayor a 1900")
    @Max(value = 2100, message = "El año no puede ser mayor a 2100")
    private Integer year;

    @NotNull(message = "El ID del propietario es obligatorio")
    private Long ownerId;
}
