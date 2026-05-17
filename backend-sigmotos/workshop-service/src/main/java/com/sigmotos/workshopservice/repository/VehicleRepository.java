package com.sigmotos.workshopservice.repository;

import com.sigmotos.workshopservice.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    boolean existsByPlateIgnoreCase(String plate);
}
