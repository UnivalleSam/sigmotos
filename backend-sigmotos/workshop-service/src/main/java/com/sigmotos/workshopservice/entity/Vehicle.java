package com.sigmotos.workshopservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La placa es obligatoria")
    @Size(max = 10, message = "La placa no puede superar 10 caracteres")
    @Column(nullable = false, unique = true, length = 10)
    private String plate;

    @NotBlank(message = "La marca es obligatoria")
    @Column(nullable = false)
    private String brand;

    @NotBlank(message = "El modelo es obligatorio")
    @Column(nullable = false)
    private String model;

    @NotNull(message = "El año es obligatorio")
    @Min(value = 1900, message = "El año debe ser mayor a 1900")
    @Max(value = 2100, message = "El año no puede ser mayor a 2100")
    @Column(nullable = false)
    private Integer year;

    @NotNull(message = "El ID del propietario es obligatorio")
    @Column(name = "owner_id", nullable = false)
    private Long ownerId;
}
