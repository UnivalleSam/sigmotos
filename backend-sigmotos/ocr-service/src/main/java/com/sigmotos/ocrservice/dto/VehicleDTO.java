package com.sigmotos.ocrservice.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Long id;
    private String plate;
    private String brand;
    private String model;
    private Integer year;
    private Long ownerId;
    private String ownerName;
}
