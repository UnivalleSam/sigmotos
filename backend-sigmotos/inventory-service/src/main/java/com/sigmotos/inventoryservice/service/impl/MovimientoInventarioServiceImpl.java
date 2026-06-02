package com.sigmotos.inventoryservice.service.impl;

import com.sigmotos.inventoryservice.dto.MovimientoRequest;
import com.sigmotos.inventoryservice.dto.MovimientoResponse;
import com.sigmotos.inventoryservice.entity.MovimientoInventario;
import com.sigmotos.inventoryservice.entity.Producto;
import com.sigmotos.inventoryservice.entity.TipoMovimiento;
import com.sigmotos.inventoryservice.exception.BusinessException;
import com.sigmotos.inventoryservice.exception.ResourceNotFoundException;
import com.sigmotos.inventoryservice.repository.MovimientoInventarioRepository;
import com.sigmotos.inventoryservice.repository.ProductoRepository;
import com.sigmotos.inventoryservice.service.MovimientoInventarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovimientoInventarioServiceImpl implements MovimientoInventarioService {

    private final MovimientoInventarioRepository movimientoRepository;
    private final ProductoRepository productoRepository;

    @Override
    @Transactional
    public MovimientoResponse registrarMovimiento(MovimientoRequest request, Long usuarioId) {
        Producto producto = productoRepository.findByIdAndActivoTrue(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", request.getProductoId()));

        // Aplicar movimiento según tipo
        switch (request.getTipoMovimiento()) {
            case ENTRADA:
                producto.setStockActual(producto.getStockActual() + request.getCantidad());
                log.info("ENTRADA de inventario: producto='{}', cantidad={}, nuevo stock={}",
                        producto.getNombre(), request.getCantidad(), producto.getStockActual());
                break;

            case SALIDA:
                int nuevoStock = producto.getStockActual() - request.getCantidad();
                if (nuevoStock < 0) {
                    throw new BusinessException(
                            String.format("Stock insuficiente para el producto '%s'. " +
                                            "Stock actual: %d, cantidad solicitada: %d",
                                    producto.getNombre(),
                                    producto.getStockActual(),
                                    request.getCantidad()));
                }
                producto.setStockActual(nuevoStock);
                log.info("SALIDA de inventario: producto='{}', cantidad={}, nuevo stock={}",
                        producto.getNombre(), request.getCantidad(), producto.getStockActual());
                break;

            case AJUSTE:
                log.info("AJUSTE de inventario: producto='{}', stock anterior={}, nuevo stock={}",
                        producto.getNombre(), producto.getStockActual(), request.getCantidad());
                producto.setStockActual(request.getCantidad());
                break;
        }

        // Guardar producto con stock actualizado
        productoRepository.save(producto);

        // Verificar alerta de stock
        if (producto.getStockActual() <= producto.getStockMinimo()) {
            log.warn("⚠️ ALERTA DE STOCK: El producto '{}' (código: {}) tiene stock bajo. " +
                            "Stock actual: {}, Stock mínimo: {}",
                    producto.getNombre(),
                    producto.getCodigo(),
                    producto.getStockActual(),
                    producto.getStockMinimo());
        }

        // Crear movimiento
        MovimientoInventario movimiento = MovimientoInventario.builder()
                .producto(producto)
                .tipoMovimiento(request.getTipoMovimiento())
                .cantidad(request.getCantidad())
                .motivo(request.getMotivo())
                .usuarioId(usuarioId)
                .build();

        MovimientoInventario saved = movimientoRepository.save(movimiento);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoResponse> obtenerTodos() {
        return movimientoRepository.findAllByOrderByFechaMovimientoDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoResponse> obtenerPorProductoId(Long productoId) {
        // Verificar que el producto existe
        if (!productoRepository.existsById(productoId)) {
            throw new ResourceNotFoundException("Producto", "id", productoId);
        }

        return movimientoRepository.findByProductoIdOrderByFechaMovimientoDesc(productoId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- Métodos privados ---

    private MovimientoResponse mapToResponse(MovimientoInventario movimiento) {
        return MovimientoResponse.builder()
                .id(movimiento.getId())
                .productoId(movimiento.getProducto().getId())
                .productoNombre(movimiento.getProducto().getNombre())
                .productoCodigo(movimiento.getProducto().getCodigo())
                .tipoMovimiento(movimiento.getTipoMovimiento())
                .cantidad(movimiento.getCantidad())
                .motivo(movimiento.getMotivo())
                .fechaMovimiento(movimiento.getFechaMovimiento())
                .usuarioId(movimiento.getUsuarioId())
                .build();
    }
}
