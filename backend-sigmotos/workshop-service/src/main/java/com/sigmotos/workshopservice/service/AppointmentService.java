package com.sigmotos.workshopservice.service;

import com.sigmotos.workshopservice.dto.AppointmentDto;
import com.sigmotos.workshopservice.dto.UpdateAppointmentStatusDto;
import com.sigmotos.workshopservice.entity.Appointment;
import com.sigmotos.workshopservice.entity.AppointmentStatus;
import com.sigmotos.workshopservice.entity.WorkOrder;
import com.sigmotos.workshopservice.entity.WorkOrderStatus;
import com.sigmotos.workshopservice.exception.ResourceNotFoundException;
import com.sigmotos.workshopservice.repository.AppointmentRepository;
import com.sigmotos.workshopservice.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final WorkOrderRepository workOrderRepository;

    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAllByOrderByAppointmentDateAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AppointmentDto getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));
        return mapToDto(appointment);
    }

    public AppointmentDto createAppointment(AppointmentDto dto) {
        Appointment appointment = Appointment.builder()
                .clientId(dto.getClientId())
                .vehicleId(dto.getVehicleId())
                .appointmentDate(dto.getAppointmentDate())
                .reason(dto.getReason())
                .status(AppointmentStatus.PENDING)
                .build();
        return mapToDto(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentDto updateStatus(Long id, UpdateAppointmentStatusDto statusDto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));

        AppointmentStatus oldStatus = appointment.getStatus();
        AppointmentStatus newStatus = statusDto.getStatus();

        appointment.setStatus(newStatus);
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Si cambia de algo distinto a ACEPTADA -> ACEPTADA, creamos el WorkOrder borrador
        if (oldStatus != AppointmentStatus.ACCEPTED && newStatus == AppointmentStatus.ACCEPTED) {
            WorkOrder workOrder = WorkOrder.builder()
                    .appointmentId(appointment.getId())
                    .clientId(appointment.getClientId())
                    .vehicleId(appointment.getVehicleId())
                    .status(WorkOrderStatus.DRAFT)
                    .notes("Orden de trabajo generada a partir de la cita aceptada.")
                    .build();
            workOrderRepository.save(workOrder);
        }

        return mapToDto(savedAppointment);
    }

    private AppointmentDto mapToDto(Appointment appointment) {
        return AppointmentDto.builder()
                .id(appointment.getId())
                .clientId(appointment.getClientId())
                .vehicleId(appointment.getVehicleId())
                .appointmentDate(appointment.getAppointmentDate())
                .reason(appointment.getReason())
                .status(appointment.getStatus())
                .build();
    }
}
