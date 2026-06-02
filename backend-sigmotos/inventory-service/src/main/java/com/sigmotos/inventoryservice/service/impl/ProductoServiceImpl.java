package com.sigmotos.inventoryservice.service.impl;

import com.sigmotos.inventoryservice.dto.ProductoRequest;
import com.sigmotos.inventoryservice.dto.ProductoResponse;
import com.sigmotos.inventoryservice.entity.Producto;
import com.sigmotos.inventoryservice.exception.BusinessException;
import com.sigmotos.inventoryservice.exception.ResourceNotFoundException;
import com.sigmotos.inventoryservice.repository.ProductoRepository;
import com.sigmotos.inventoryservice.service.ProductoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    @Override
    @Transactional
    public ProductoResponse crearProducto(ProductoRequest request) {
        // Validar código único
        if (productoRepository.existsByCodigo(request.getCodigo())) {
            throw new BusinessException("Ya existe un producto con el código: " + request.getCodigo());
        }

        Producto producto = Producto.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .codigo(request.getCodigo())
                .marca(request.getMarca())
                .categoria(request.getCategoria())
                .precioCompra(request.getPrecioCompra())
                .precioVenta(request.getPrecioVenta())
                .stockActual(request.getStockActual())
                .stockMinimo(request.getStockMinimo())
                .ubicacion(request.getUbicacion())
                .activo(true)
                .build();

        Producto saved = productoRepository.save(producto);

        // Verificar alerta de stock
        verificarAlertaStock(saved);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponse> obtenerTodos() {
        return productoRepository.findByActivoTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponse obtenerPorId(Long id) {
        Producto producto = productoRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        return mapToResponse(producto);
    }

    @Override
    @Transactional
    public ProductoResponse actualizarProducto(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));

        // Validar código único si cambió
        if (!producto.getCodigo().equals(request.getCodigo())
                && productoRepository.existsByCodigo(request.getCodigo())) {
            throw new BusinessException("Ya existe un producto con el código: " + request.getCodigo());
        }

        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setCodigo(request.getCodigo());
        producto.setMarca(request.getMarca());
        producto.setCategoria(request.getCategoria());
        producto.setPrecioCompra(request.getPrecioCompra());
        producto.setPrecioVenta(request.getPrecioVenta());
        producto.setStockActual(request.getStockActual());
        producto.setStockMinimo(request.getStockMinimo());
        producto.setUbicacion(request.getUbicacion());

        Producto updated = productoRepository.save(producto);

        // Verificar alerta de stock
        verificarAlertaStock(updated);

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void eliminarProducto(Long id) {
        Producto producto = productoRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));

        producto.setActivo(false);
        productoRepository.save(producto);

        log.info("Producto eliminado lógicamente: id={}, código={}", id, producto.getCodigo());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponse> obtenerProductosConAlertaStock() {
        return productoRepository.findByActivoTrue().stream()
                .filter(p -> p.getStockActual() <= p.getStockMinimo())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- Métodos privados ---

    private ProductoResponse mapToResponse(Producto producto) {
        return ProductoResponse.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .codigo(producto.getCodigo())
                .marca(producto.getMarca())
                .categoria(producto.getCategoria())
                .precioCompra(producto.getPrecioCompra())
                .precioVenta(producto.getPrecioVenta())
                .stockActual(producto.getStockActual())
                .stockMinimo(producto.getStockMinimo())
                .ubicacion(producto.getUbicacion())
                .activo(producto.getActivo())
                .alertaStock(producto.getStockActual() <= producto.getStockMinimo())
                .fechaCreacion(producto.getFechaCreacion())
                .fechaActualizacion(producto.getFechaActualizacion())
                .build();
    }

    private void verificarAlertaStock(Producto producto) {
        if (producto.getStockActual() <= producto.getStockMinimo()) {
            log.warn("⚠️ ALERTA DE STOCK: El producto '{}' (código: {}) tiene stock bajo. " +
                            "Stock actual: {}, Stock mínimo: {}",
                    producto.getNombre(),
                    producto.getCodigo(),
                    producto.getStockActual(),
                    producto.getStockMinimo());
        }
    }
}
