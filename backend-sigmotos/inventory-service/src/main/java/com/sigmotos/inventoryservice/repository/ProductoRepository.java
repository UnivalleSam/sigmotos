package com.sigmotos.inventoryservice.repository;

import com.sigmotos.inventoryservice.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    Optional<Producto> findByCodigoAndActivoTrue(String codigo);

    Optional<Producto> findByIdAndActivoTrue(Long id);

    List<Producto> findByActivoTrue();

    List<Producto> findByCategoriaAndActivoTrue(String categoria);

    List<Producto> findByMarcaAndActivoTrue(String marca);

    List<Producto> findByNombreContainingIgnoreCaseAndActivoTrue(String nombre);

    boolean existsByCodigo(String codigo);

    List<Producto> findByStockActualLessThanEqualAndActivoTrue(Integer stockMinimo);
}
