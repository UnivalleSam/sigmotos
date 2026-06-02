package com.sigmotos.inventoryservice.repository;

import com.sigmotos.inventoryservice.entity.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {

    List<MovimientoInventario> findAllByOrderByFechaMovimientoDesc();

    List<MovimientoInventario> findByProductoIdOrderByFechaMovimientoDesc(Long productoId);
}
