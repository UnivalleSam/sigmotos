package com.sigmotos.workshopservice.dto;

import com.sigmotos.workshopservice.entity.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAppointmentStatusDto {
    private AppointmentStatus status;
}
