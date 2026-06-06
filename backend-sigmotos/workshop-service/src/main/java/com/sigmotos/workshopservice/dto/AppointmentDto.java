package com.sigmotos.workshopservice.dto;

import com.sigmotos.workshopservice.entity.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private Long id;
    private Long clientId;
    private Long vehicleId;
    private LocalDateTime appointmentDate;
    private String reason;
    private AppointmentStatus status;
}
