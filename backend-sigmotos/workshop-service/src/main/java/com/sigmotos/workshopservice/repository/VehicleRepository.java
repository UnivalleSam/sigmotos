package com.sigmotos.workshopservice.repository;

import com.sigmotos.workshopservice.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByPlateIgnoreCase(String plate);

    boolean existsByPlateIgnoreCase(String plate);

    List<Vehicle> findByOwnerId(Long ownerId);
}
